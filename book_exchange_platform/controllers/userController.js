const asyncHandler = require('express-async-handler');
const userService = require('../services/userService');
const bookService = require('../services/bookService');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { blacklistToken } = require('../middleware/tokenBlacklist');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, location } = req.body;
  const userExists = await userService.findUserByEmail(email);

  if (userExists) {
    res.status(400).json({ message: 'User already exists' }); // 400 Bad Request
    return;
  }

  const user = await userService.createUser({ name, email, password, location });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' }); // 400 Bad Request
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.findUserByEmail(email);

  if (user && (await userService.comparePassword(user, password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' }); // 401 Unauthorized
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
  const user = await userService.findUserById(req.user._id);

  if (user) {
    // Delete all books associated with the user
    await bookService.deleteBooksByUserId(req.user._id);
    await userService.deleteUserById(req.user._id);
    res.json({ message: 'User and associated books removed' });
  } else {
    res.status(404).json({ message: 'User not found' }); // 404 Not Found
  }
});


// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userService.findUserByEmail(email);

  if (!user) {
    res.status(404).json({ message: 'User not found' }); // 404 Not Found
    return;
  }

  // Generate OTP
  const otp = userService.generateOtp();

  // Send OTP to user's email
  await userService.sendOtpEmail(user, otp);

  // Save OTP and expiry to user
  await userService.setResetPasswordToken(user, otp);

  res.status(200).json({ message: 'OTP sent to email' }); // 200 OK
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
    res.status(400).json({ message: 'Invalid OTP or OTP expired' }); // 400 Bad Request
    return;
  }

  // Set new password
  await userService.resetPassword(user, newPassword);

  res.status(200).json({ message: 'Password reset successfully' }); //  200 OK
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await userService.findUserById(req.user._id);

  if (user) {
    const updatedUser = await userService.updateUserProfile(user, req.body);

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
