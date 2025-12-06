import { errorResponse } from "../utils/response.js";

export function errorHandler(err, req, res, next) {
  console.error("Error Middleware:", err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
   
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
