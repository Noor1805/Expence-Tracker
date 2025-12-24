import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";

export const createBudget = async (userId, data) => {
  const { overallBudget, categoryBudgets, month, year } = data;

  const existingBudget = await Budget.findOne({ user: userId, month, year });
  if (existingBudget) {
    throw new Error("Budget already exists for this month and year");
  }

  return await Budget.create({
    user: userId,
    overallBudget: overallBudget || 0,
    categoryBudgets: categoryBudgets || [],
    month,
    year,
  });
};

export const upsertCategoryBudget = async (userId, category, limit) => {
  let categoryId = category;

  // Resolve Category ID if name provided
  if (!mongoose.Types.ObjectId.isValid(category)) {
    const catDoc = await Category.findOne({
      name: { $regex: new RegExp(`^${category}$`, "i") },
      user: userId,
    });

    if (!catDoc) {
      throw new Error(
        `Category '${category}' not found. Please create it first.`
      );
    }
    categoryId = catDoc._id.toString();
  }

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  let budget = await Budget.findOne({ user: userId, month, year });

  if (!budget) {
    budget = new Budget({
      user: userId,
      month,
      year,
      categoryBudgets: [],
      overallBudget: 0,
    });
  }

  const index = budget.categoryBudgets.findIndex(
    (cb) => cb.category === categoryId || cb.category === category
  );

  const numLimit = Number(limit);

  if (index > -1) {
    budget.categoryBudgets[index].amount = numLimit;
    budget.categoryBudgets[index].category = categoryId;
  } else {
    budget.categoryBudgets.push({ category: categoryId, amount: numLimit });
  }

  // Recalculate overall if needed, or keeping it sync behavior from controller
  budget.overallBudget = budget.categoryBudgets.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return await budget.save();
};

export const getBudgetsWithSpent = async (userId) => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const budget = await Budget.findOne({ user: userId, month, year });
  if (!budget) return [];

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 1);

  const expenses = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type: "expense",
        date: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
  ]);

  const expenseMap = {};
  expenses.forEach((e) => {
    expenseMap[e._id] = e.total;
  });

  const categoryIds = budget.categoryBudgets
    .map((cb) => cb.category)
    .filter((id) => mongoose.Types.ObjectId.isValid(id));

  const categoriesDb = await Category.find({ _id: { $in: categoryIds } });
  const categoryMap = {};

  categoriesDb.forEach((c) => {
    categoryMap[c._id.toString()] = c;
  });

  return budget.categoryBudgets.map((cb) => {
    const catObj = categoryMap[cb.category];
    const catName = catObj
      ? catObj.name
      : mongoose.Types.ObjectId.isValid(cb.category)
      ? "Unknown"
      : cb.category;

    const spent = expenseMap[catName] || 0;

    return {
      _id: cb._id,
      category: catObj || { name: catName, type: "expense" },
      limit: cb.amount,
      spent: spent || 0,
    };
  });
};

export const getBudgetStats = async (userId, month, year) => {
  const budget = await Budget.findOne({ user: userId, month, year });
  if (!budget) return null;

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, Number(month) + 1, 1);

  const transactions = await Transaction.find({
    user: userId,
    type: "expense",
    date: { $gte: startDate, $lt: endDate },
  });

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  const categorySpent = {};
  transactions.forEach((t) => {
    if (!categorySpent[t.category]) {
      categorySpent[t.category] = 0;
    }
    categorySpent[t.category] += t.amount;
  });

  const remainingBudget = budget.overallBudget - totalSpent;

  return {
    overallBudget: budget.overallBudget,
    categoryBudgets: budget.categoryBudgets,
    totalSpent,
    remainingBudget,
    percentageUsed:
      budget.overallBudget > 0 ? (totalSpent / budget.overallBudget) * 100 : 0,
    exceeded: totalSpent > budget.overallBudget,
    categorySpent,
  };
};

export const updateBudget = async (id, userId, data) => {
  const budget = await Budget.findOne({ _id: id, user: userId });
  if (!budget) return null;

  const { overallBudget, categoryBudgets } = data;
  if (overallBudget !== undefined) budget.overallBudget = overallBudget;
  if (categoryBudgets !== undefined) budget.categoryBudgets = categoryBudgets;

  return await budget.save();
};

export const removeCategoryFromBudget = async (itemId, userId) => {
  const budget = await Budget.findOne({
    "categoryBudgets._id": itemId,
    user: userId,
  });

  if (!budget) return null; 

  const originalLength = budget.categoryBudgets.length;
  budget.categoryBudgets = budget.categoryBudgets.filter(
    (cb) => cb._id.toString() !== itemId
  );

  if (budget.categoryBudgets.length === originalLength) {
    throw new Error("Item not found in budget error");
  }

  budget.overallBudget = budget.categoryBudgets.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return await budget.save();
};
