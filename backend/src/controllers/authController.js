import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { sendEmail } from "../utils/sendEmail.js";

const SALT_ROUNDS = 10;

//register code

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({ name, email, password: hashed });

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({
      id: user._id,
      role: user.role,
    });

    user.refreshToken.push({ token: refreshToken, createdAt: new Date() });
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

// login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({
      id: user._id,
      role: user.role,
    });

    user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          currency: user.currency,
        },
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

//logout

// LOGOUT
export async function logout(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      await User.updateOne({}, { $pull: { refreshTokens: { token } } });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ success: true, message: "Logged out" });
  } catch (err) {
    next(err);
  }
}

//refreshtoken
export async function refreshToken(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "No refresh token" });

    let payload = verifyRefreshToken(token);

    const user = await User.findById(payload.id);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });

    const valid = user.refreshTokens.find((rt) => rt.token === token);
    if (!valid)
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });

    res.json({ success: true, data: { accessToken: newAccessToken } });
  } catch (err) {
    next(err);
  }
}

// GET ME
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshTokens -resetPasswordToken -resetPasswordExpires"
    );

    if (!user)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

//forgot password
export async function forgotPassword(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

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

    return res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    next(error);
  }
}

//reset password
export async function resetPassword(req, res, next) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
}
