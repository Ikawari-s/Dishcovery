import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      profilePicture: user.profilePicture,
      isVerified: user.isVerified, // return verification status
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const nameExists = await User.findOne({ name });
  if (nameExists) {
    res.status(400);
    throw new Error("Username is already taken");
  }

  // Create user
  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "User registered",
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Find user by ID from token (set in protect middleware)
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Verify current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  // Set new password (pre-save hook will hash it)
  user.password = newPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
});

export const request2FA = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Send OTP via email
  await sendEmail(
    user.email,
    "Your OTP Code",
    `Your verification code is: ${otp}. It expires in 10 minutes.`
  );

  res.json({ message: "OTP sent to your email" });
});

export const verify2FA = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.otp !== otp || user.otpExpire < Date.now()) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  // Clear OTP and mark user as verified
  user.otp = null;
  user.otpExpire = null;
  user.isVerified = true;
  await user.save();

  res.json({ message: "Account verified successfully" });
});

export const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Send OTP to email
  await sendEmail(
    user.email,
    "Password Reset OTP",
    `Your password reset OTP is: ${otp}. It expires in 10 minutes.`
  );

  res.json({ message: "Password reset OTP sent to your email" });
});

export const forgotPasswordVerify = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.otp !== otp || user.otpExpire < Date.now()) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  // OTP valid → allow reset
  user.otp = null;
  user.otpExpire = null;
  user.canResetPassword = true; // ✅ mark user can reset
  await user.save();

  res.json({ message: "OTP verified, you may reset password now" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.canResetPassword) {
    res.status(400);
    throw new Error("OTP verification required before resetting password");
  }

  // Set new password
  user.password = newPassword;
  user.canResetPassword = false; // reset flag
  await user.save();

  res.json({ message: "Password has been reset successfully" });
});
