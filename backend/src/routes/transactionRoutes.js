import express from "express";

import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  uploadReceipt,
  bulkDeleteTransactions,
  getTotalStats,
  getCategoryStats,
  getMonthlyStats,
  getPaymentMethodStats,
  getRecentTransactions,
  exportCSV,
  exportExcel,
  exportPDF,
  importTransactions,
  recurringTransactionHandler,
  duplicateTransactions,
  clearAllTransactions,
  getBalanceHistory,
  getUpcomingTransactions,
} from "../controllers/transactionController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../utils/fileUpload.js";

const router = express.Router();

router.post("/create", protect, createTransaction);
router.get("/", protect, getTransactions);

// Stats routes
router.get("/stats/total", protect, getTotalStats);
router.get("/stats/category", protect, getCategoryStats);
router.get("/stats/monthly", protect, getMonthlyStats);
router.get("/stats/payment-method", protect, getPaymentMethodStats);
router.get("/stats/balance", protect, getBalanceHistory); // New

router.get("/recent", protect, getRecentTransactions);
router.get("/upcoming", protect, getUpcomingTransactions); // New

router.get("/export/csv", protect, exportCSV);
router.get("/export/excel", protect, exportExcel);
router.get("/export/pdf", protect, exportPDF);

router.post("/import/csv", protect, upload.single("file"), importTransactions);

router.post(
  "/upload-receipt/:id",
  protect,
  upload.single("receipt"),
  uploadReceipt
);

router.post("/bulk-delete", protect, bulkDeleteTransactions);
router.post("/duplicate/:id", protect, duplicateTransactions);
router.delete("/clear/all", protect, clearAllTransactions);

router.get("/:id", protect, getTransactionById);
router.put("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);

router.post("/recurring/process", protect, recurringTransactionHandler);

export default router;
