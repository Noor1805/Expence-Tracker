import express from "express";
import {
  register,
  login,
  logout,
  logoutAll,
  refreshToken,
  getMe,
  deleteAccount,
} from "../controllers/authController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { loginLimiter } from "../middlewares/rateLimitMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", loginLimiter, login);

router.post("/refresh-token", refreshToken);

router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.post("/logout-all", protect, logoutAll);
router.delete("/delete-account", protect, deleteAccount);

export default router;
