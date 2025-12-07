import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createCategory);

router.get("/", protect, getCategories);

router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);

export default router;
