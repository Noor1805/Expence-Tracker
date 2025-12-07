import express from "express";
import {
  getAllUsers,
  getUserDetails,
  deleteUser,
  toggleBlockUser,
  promoteToAdmin,
  getAppStats,
} from "../controllers/adminController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

const adminAccess = [protect, authorizeRoles("admin")];

router.get("/users", adminAccess, getAllUsers);

router.get("/users/:id", adminAccess, getUserDetails);

router.delete("/users/:id", adminAccess, deleteUser);

router.put("/users/block/:id", adminAccess, toggleBlockUser);

router.put("/users/promote/:id", adminAccess, promoteToAdmin);

router.get("/stats/app", adminAccess, getAppStats);

export default router;
