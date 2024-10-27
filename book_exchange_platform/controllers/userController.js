const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Book = require('../models/bookModel');
const generateToken = require('../utils/generateToken');
const { blacklistToken } = require('../middleware/tokenBlacklist')
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, location } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    location
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});


// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  blacklistToken(token);
  res.status(200).json({ message: 'User logged out successfully' });
});

// @desc    Delete user
// @route   DELETE /api/users/me
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Delete all books associated with the user
    await Book.deleteMany({ user: req.user._id });
    // Delete user
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'User and associated books removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Generate OTP
  const otp = crypto.randomBytes(3).toString('hex');

  // Send OTP to user's email
  const message = `Hi ${user.name},
                  Your OTP for password reset is ${otp}.
                  It is valid for 10 minutes.

                  Do not share with anyone.
                  `;
  await sendEmail({
    email: user.email,
    subject: 'Password Reset OTP - Book Exchange Platform',
    message,
  });

  // Save OTP and expiry to user
  user.resetPasswordToken = otp;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  res.status(200).json({ message: 'OTP sent to email' });
});

// @desc    Reset password
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({
    email,
    resetPasswordToken: otp,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid OTP or OTP expired');
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successfully' });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.location = req.body.location || user.location;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      location: updatedUser.location,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { registerUser, loginUser, logoutUser, deleteUser, forgotPassword, resetPassword, updateUserProfile };