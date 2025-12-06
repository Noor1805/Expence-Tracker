import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Try again in 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 3, 
  message: {
    success: false,
    message: "Too many reset attempts. Try again in 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
