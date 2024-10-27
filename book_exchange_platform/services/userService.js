const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const createUser = async ({ name, email, password, location }) => {
  const user = new User({ name, email, password, location });
  await user.save();
  return user;
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserById = async (id) => {
  return await User.findById(id);
};

const comparePassword = async (user, password) => {
  return await bcrypt.compare(password, user.password);
};

const deleteUserById = async (userId) => {
  await User.findByIdAndDelete(userId);
};

const updateUserProfile = async (user, updateData) => {
  user.name = updateData.name || user.name;
  user.email = updateData.email || user.email;
  user.location = updateData.location || user.location;
  if (updateData.password) {
    user.password = updateData.password;
  }
  return await user.save();
};

const generateOtp = () => {
  return crypto.randomBytes(3).toString('hex');
};

const sendOtpEmail = async (user, otp) => {
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
};

const setResetPasswordToken = async (user, otp) => {
  user.resetPasswordToken = otp;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();
};

const resetPassword = async (user, newPassword) => {
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  comparePassword,
  deleteUserById,
  updateUserProfile,
  generateOtp,
  sendOtpEmail,
  setResetPasswordToken,
  resetPassword,
};
