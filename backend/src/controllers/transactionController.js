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

    if (!transaction)
      return errorResponse(res, "Transaction not found", 404);

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

    if (!transaction)
      return errorResponse(res, "Transaction not found", 404);

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

    if (!deleted)
      return errorResponse(res, "Transaction not found", 404);

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

export const uploadReceipt = async (req, res) => {
  try {
    if (!req.file)
      return errorResponse(res, "No file uploaded", 400);

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction)
      return errorResponse(res, "Transaction not found", 404);

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
    res.setHeader("Content-Disposition", "attachment; filename=transactions.xlsx");

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
