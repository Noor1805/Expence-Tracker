import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { sendEmail } from "../utils/sendEmail.js";

const SALT_ROUNDS = 10;

export const registerUser = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error("Email already exists");
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, password: hashed });

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({
    id: user._id,
    role: user.role,
  });

  user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
  await user.save();

  return { user, accessToken, refreshToken };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({
    id: user._id,
    role: user.role,
  });

  user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
  await user.save();

  return { user, accessToken, refreshToken };
};

export const logoutUser = async (token) => {
  if (token) {
    await User.updateOne({}, { $pull: { refreshTokens: { token } } });
  }
};

export const logoutAllDevices = async (userId) => {
  await User.updateOne({ _id: userId }, { $set: { refreshTokens: [] } });
};

export const refreshUserToken = async (token) => {
  if (!token) throw new Error("No refresh token");

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch (err) {
    throw new Error("Invalid refresh token");
  }

  const user = await User.findById(payload.id);
  if (!user) throw new Error("User not found");

  const valid = user.refreshTokens.find((rt) => rt.token === token);
  if (!valid) throw new Error("Invalid refresh token");

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
  });

  return { accessToken };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "-password -refreshTokens -resetPasswordToken -resetPasswordExpires"
  );
  if (!user) throw new Error("User not found");
  return user;
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email not found");

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset:</p>
      <a href="${resetURL}">${resetURL}</a>
    `,
  });

  return { message: "Password reset email sent" };
};

export const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired password reset token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  return { message: "Password reset successful" };
};

export const deleteUserAccount = async (userId, token) => {
  await User.findByIdAndDelete(userId);
  // No explicit token invalidation needed as user is gone, but good practice to clear cookie in controller
};
