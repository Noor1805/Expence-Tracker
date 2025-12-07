import express from "express";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getNotifications);
router.put("/read/:id", markAsRead);
router.delete("/:id", deleteNotification);
router.delete("/clear/all", clearAllNotifications);

export default router;
