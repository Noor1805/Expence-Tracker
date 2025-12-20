import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import cloudinary from "../config/cloudinary.js";
import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";

import { exportToCSV } from "../utils/csvExport.js";
import { exportToExcel } from "../utils/excelExport.js";
import { generatePDF } from "../utils/pdfExport.js";

import { successResponse, errorResponse } from "../utils/response.js";

export const createTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return errorResponse(res, "Validation failed", 400, errors.array());

    const transaction = await Transaction.create({
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
    const { page = 1, limit = 10, sort = "desc", ...filters } = req.query;
    const query = { user: req.user.id };

    if (filters.type) query.type = filters.type;
    if (filters.category) query.category = filters.category;
    if (filters.paymentMethod) query.paymentMethod = filters.paymentMethod;

    if (filters.startDate && filters.endDate) {
      query.date = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      };
    }

    if (filters.search) {
      query.note = { $regex: filters.search, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const sortOrder = sort === "desc" ? -1 : 1;

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ date: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    return successResponse(res, "Transactions fetched", {
      transactions,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Get Transactions Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

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

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { ...req.body },
      { new: true }
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
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

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

    const result = await Transaction.deleteMany({
      _id: { $in: ids },
      user: req.user.id,
    });

    return successResponse(res, `${result.deletedCount} deleted`);
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export const clearAllTransactions = async (req, res) => {
  try {
    const result = await Transaction.deleteMany({ user: req.user.id });
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

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

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
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return errorResponse(res, "Transaction not found", 404);

    const newTransaction = await Transaction.create({
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

// Basic implementation to find recurring transactions
export const getUpcomingTransactions = async (req, res) => {
  try {
    const recurring = await Transaction.find({
      user: req.user.id,
      isRecurring: true,
    });
    // For a real app, you'd calculate the next date. Simplified here:
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
    const stats = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    const data = stats[0] || { totalIncome: 0, totalExpense: 0 };

    return successResponse(res, "Total stats fetched", {
      totalIncome: data.totalIncome,
      totalExpense: data.totalExpense,
      balance: data.totalIncome - data.totalExpense,
    });
  } catch (error) {
    console.error("Get Total Stats Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export const getBalanceHistory = async (req, res) => {
  try {
    const days = 30;
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const history = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: dateLimit },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          dailyIncome: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          dailyExpense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    return successResponse(res, "Balance history fetched", history);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getCategoryStats = async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          type: "expense",
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);
    return successResponse(res, "Category stats fetched", stats);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getMonthlyStats = async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    return successResponse(res, "Monthly stats fetched", stats);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getPaymentMethodStats = async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $group: {
          _id: { $toLower: "$paymentMethod" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);
    return successResponse(res, "Payment stats fetched", stats);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(5);

    return successResponse(res, "Recent transactions fetched", transactions);
  } catch (error) {
    console.error("Get Recent Transactions Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};
