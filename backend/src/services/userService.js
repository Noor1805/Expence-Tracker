import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
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

  if (user.isBlocked) {
    throw new Error("Account is blocked. Please contact support.");
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

export const deleteUserAccount = async (userId, token) => {
  await User.findByIdAndDelete(userId);
};
