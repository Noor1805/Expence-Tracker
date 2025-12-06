import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";

export function protect(req, res, next) {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return errorResponse(res, "Not authorized, token missing", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return errorResponse(res, "Token invalid or expired", 401);
  }
}
export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, "You do not have permission for this action", 403);
    }
    next();
  };
}

