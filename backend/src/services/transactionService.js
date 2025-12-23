import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

export const createTransaction = async (data) => {
  return await Transaction.create(data);
};

export const getTransactions = async (userId, queryParams) => {
  const { page = 1, limit = 10, sort = "desc", ...filters } = queryParams;
  const query = { user: userId };

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

  return {
    transactions,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
  };
};

export const getTransactionById = async (id, userId) => {
  return await Transaction.findOne({ _id: id, user: userId });
};

export const updateTransaction = async (id, userId, data) => {
  return await Transaction.findOneAndUpdate(
    { _id: id, user: userId },
    { ...data },
    { new: true }
  );
};

export const deleteTransaction = async (id, userId) => {
  return await Transaction.findOneAndDelete({ _id: id, user: userId });
};

export const bulkDeleteTransactions = async (ids, userId) => {
  return await Transaction.deleteMany({
    _id: { $in: ids },
    user: userId,
  });
};

export const clearAllTransactions = async (userId) => {
  return await Transaction.deleteMany({ user: userId });
};

export const getSimpleStats = async (userId) => {
  const stats = await Transaction.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
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
  return {
    ...data,
    balance: data.totalIncome - data.totalExpense,
  };
};

export const getBalanceHistory = async (userId, days = 30) => {
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  return await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
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
};

export const getCategoryStats = async (userId) => {
  return await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type: "expense",
      },
    },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    { $sort: { total: -1 } },
  ]);
};

export const getMonthlyStats = async (userId) => {
  return await Transaction.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
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
};

export const getPaymentMethodStats = async (userId) => {
  return await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
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
};

export const getRecentTransactions = async (userId, limit = 5) => {
  return await Transaction.find({ user: userId })
    .sort({ date: -1 })
    .limit(limit);
};
