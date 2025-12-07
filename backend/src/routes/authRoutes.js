import express from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import { protect } from "../middlewares/authMiddleware.js";
import {
  loginLimiter,
  forgotPasswordLimiter,
} from "../middlewares/rateLimitMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", loginLimiter, login);

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/refresh-token", refreshToken);

router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;
