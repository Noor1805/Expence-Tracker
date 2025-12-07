import express from "express";
import {
  setBudget,
  getBudgetStats,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/set", protect, setBudget);

router.get("/stats", protect, getBudgetStats);

router.put("/update/:id", protect, updateBudget);

router.delete("/delete/:id", protect, deleteBudget);

export default router;
