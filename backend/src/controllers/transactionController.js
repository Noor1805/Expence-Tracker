import * as transactionService from "../services/transactionService.js";
import cloudinary from "../config/cloudinary.js";
import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";

import { exportToCSV } from "../utils/csvExport.js";
import { exportToExcel } from "../utils/excelExport.js";
import { generatePDF } from "../utils/pdfExport.js";

import { successResponse, errorResponse } from "../utils/response.js";
import Transaction from "../models/Transaction.js"; // Needed for exports for now or should move export logic too

export const createTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return errorResponse(res, "Validation failed", 400, errors.array());

    const transaction = await transactionService.createTransaction({
      user: req.user.id,
      ...req.body,
    });

    return successResponse(res, "Transaction created", transaction, 201);
  } catch (error) {
    console.error("Create Transaction Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export const getTransactions = async (req, res) => {
  try {
    const result = await transactionService.getTransactions(
      req.user.id,
      req.query
    );
    return successResponse(res, "Transactions fetched", result);
  } catch (error) {
    console.error("Get Transactions Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.id,
      req.user.id
    );

    if (!transaction) return errorResponse(res, "Transaction not found", 404);

    return successResponse(res, "Transaction fetched", transaction);
  } catch (error) {
    console.error("Get Transaction Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return errorResponse(res, "Validation failed", 400, errors.array());

    const transaction = await transactionService.updateTransaction(
      req.params.id,
      req.user.id,
      req.body
    );

    if (!transaction) return errorResponse(res, "Transaction not found", 404);

    return successResponse(res, "Transaction updated", transaction);
  } catch (error) {
    console.error("Update Transaction Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const deleted = await transactionService.deleteTransaction(
      req.params.id,
      req.user.id
    );

    if (!deleted) return errorResponse(res, "Transaction not found", 404);

    return successResponse(res, "Transaction deleted");
  } catch (error) {
    console.error("Delete Transaction Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export const bulkDeleteTransactions = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids))
      return errorResponse(res, "Invalid IDs list", 400);

    const result = await transactionService.bulkDeleteTransactions(
      ids,
      req.user.id
    );

    return successResponse(res, `${result.deletedCount} deleted`);
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export const clearAllTransactions = async (req, res) => {
  try {
    const result = await transactionService.clearAllTransactions(req.user.id);
    return successResponse(
      res,
      `All transactions cleared: ${result.deletedCount} items removed`
    );
  } catch (error) {
    console.error("Clear All Transactions Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export const uploadReceipt = async (req, res) => {
  try {
    if (!req.file) return errorResponse(res, "No file uploaded", 400);

    const transaction = await transactionService.getTransactionById(
      req.params.id,
      req.user.id
    );

    if (!transaction) return errorResponse(res, "Transaction not found", 404);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "expense-tracker/receipts",
        public_id: uuidv4(),
        resource_type: "image",
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return errorResponse(res, "Cloudinary upload failed", 500);
        }

        transaction.receiptUrl = result.secure_url;
        await transaction.save();

        return successResponse(res, "Receipt uploaded", {
          url: result.secure_url,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error("Upload Receipt Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export const exportCSV = async (req, res) => {
  try {
    // Keep this direct specifically for exports or create a service function that returns cursor?
    // For now, simpler to use service to get all and then export
    const transactions = await Transaction.find({ user: req.user.id });

    if (!transactions.length)
      return errorResponse(res, "No transactions found", 404);

    const fields = [
      "type",
      "category",
      "amount",
      "paymentMethod",
      "date",
      "notes",
    ];

    const csv = exportToCSV(transactions, fields);

    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");

    return res.send(csv);
  } catch (error) {
    console.error("CSV Export Error:", error);
    return errorResponse(res, "Failed to export CSV", 500);
  }
};

export const exportExcel = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    if (!transactions.length)
      return errorResponse(res, "No transactions found", 404);

    const fileBuffer = await exportToExcel(transactions);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transactions.xlsx"
    );

    return res.send(fileBuffer);
  } catch (error) {
    console.error("Excel Export Error:", error);
    return errorResponse(res, "Failed to export Excel", 500);
  }
};

export const exportPDF = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    if (!transactions.length)
      return errorResponse(res, "No transactions found", 404);

    generatePDF(transactions, res);
  } catch (error) {
    console.error("PDF Export Error:", error);
    return errorResponse(res, "Failed to export PDF", 500);
  }
};

export const duplicateTransactions = async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.id,
      req.user.id
    ); // Reusing service
    if (!transaction) return errorResponse(res, "Transaction not found", 404);

    const newTransaction = await transactionService.createTransaction({
      ...transaction.toObject(),
      _id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      user: req.user.id,
    });
    return successResponse(res, "Transaction duplicated", newTransaction, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getUpcomingTransactions = async (req, res) => {
  try {
    // This was basic implementation using direct find. Move to Service?
    // Using direct find here as it's partial implementation in original code
    const recurring = await Transaction.find({
      user: req.user.id,
      isRecurring: true,
    });
    return successResponse(res, "Upcoming transactions fetched", recurring);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const recurringTransactionHandler = async (req, res) => {
  return successResponse(res, "Recurring functionality not implemented yet");
};

export const importTransactions = async (req, res) => {
  return successResponse(res, "Import functionality not implemented yet");
};

export const getTotalStats = async (req, res) => {
  try {
    const stats = await transactionService.getSimpleStats(req.user.id);
    return successResponse(res, "Total stats fetched", stats);
  } catch (error) {
    console.error("Get Total Stats Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export const getBalanceHistory = async (req, res) => {
  try {
    const history = await transactionService.getBalanceHistory(req.user.id);
    return successResponse(res, "Balance history fetched", history);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getCategoryStats = async (req, res) => {
  try {
    const stats = await transactionService.getCategoryStats(req.user.id);
    return successResponse(res, "Category stats fetched", stats);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getMonthlyStats = async (req, res) => {
  try {
    const stats = await transactionService.getMonthlyStats(req.user.id);
    return successResponse(res, "Monthly stats fetched", stats);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getPaymentMethodStats = async (req, res) => {
  try {
    const stats = await transactionService.getPaymentMethodStats(req.user.id);
    return successResponse(res, "Payment stats fetched", stats);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getRecentTransactions(
      req.user.id
    );
    return successResponse(res, "Recent transactions fetched", transactions);
  } catch (error) {
    console.error("Get Recent Transactions Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};
