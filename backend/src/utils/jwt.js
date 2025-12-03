import jwt from "jsonwebtoken";

const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";

export function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: ACCESS_EXPIRES})
}

export function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_SECRET, {expiresIn : REFRESH_EXPIRES})
}

export function verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export function verifyRefreshToken(token) {
    return jwt.verify(token, process.env.REFRESH_SECRET);
}