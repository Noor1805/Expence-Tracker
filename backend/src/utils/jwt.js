import jwt from "jsonwebtoken";

const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";

export function generateAccessToken(payload) {
  const secret =
    process.env.JWT_SECRET || "fallback_secret_do_not_use_in_production";
  return jwt.sign(payload, secret, { expiresIn: ACCESS_EXPIRES });
}

export function generateRefreshToken(payload) {
  const secret =
    process.env.REFRESH_SECRET ||
    process.env.JWT_SECRET ||
    "fallback_secret_do_not_use_in_production";
  return jwt.sign(payload, secret, { expiresIn: REFRESH_EXPIRES });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.REFRESH_SECRET);
}
