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

  if (!budget) return null; // Or throw error

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

import Notification from "../models/Notification.js";

export const checkBudgetExceeded = async (
  userId,
  amount,
  categoryName,
  transactionDate
) => {
  try {
    const notifications = [];
    const dateObj = new Date(transactionDate || Date.now());
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();

    console.log(
      `Checking budget for User: ${userId}, Month: ${month}, Year: ${year}, Cat: ${categoryName}, Amount: ${amount}`
    );

    // Get stats for the specific month of the transaction
    const stats = await getBudgetStats(userId, month, year);

    if (!stats) {
      console.log("No budget found for this month.");
      return;
    }

    console.log(
      `Overall Budget: ${stats.overallBudget}, Total Spent: ${stats.totalSpent}`
    );

    // 1. Overall Budget Check
    if (stats.overallBudget > 0 && stats.totalSpent > stats.overallBudget) {
      const previousTotal = stats.totalSpent - amount;
      if (previousTotal <= stats.overallBudget) {
        notifications.push({
          user: userId,
          title: "Overall Budget Exceeded",
          message: `You have exceeded your overall monthly budget of ${stats.overallBudget}. Current spent: ${stats.totalSpent}`,
          type: "warning",
        });
      }
    }

    // 2. Category Budget Check
    // We need budget limits. getBudgetStats returns categoryBudgets which has limits.
    // stats.categoryBudgets: [{ category: ID, amount: Limit, ... }]
    // stats.categorySpent: { [Name]: Amount }

    // We need to match categoryName to the budget entry.
    // Issue: stats.categoryStats keys are names, but categoryBudgets has IDs.
    // We must resolve names.
    // Let's call getBudgetsWithSpent but we need it for the specific month/year?
    // getBudgetsWithSpent uses `now` internally in previous implementation!
    // We need to refactor getBudgetsWithSpent to accept month/year or query manually here.

    // To be safe and quick, let's fetch the Category document to get ID if name is provided.
    let categoryId = categoryName;
    let categoryObj = null;

    // Prepare comparison values
    // Assume categoryName passed is what is stored in Transaction.
    // If it's a name, we try to find a category with that name.
    if (categoryName && !mongoose.Types.ObjectId.isValid(categoryName)) {
      categoryObj = await Category.findOne({
        name: categoryName,
        user: userId,
      });
      if (categoryObj) categoryId = categoryObj._id.toString();
    }

    // stats.categoryBudgets contains the limits defined in Budget model.
    // We iterate these limits to find the one matching our category.
    const catBudget = stats.categoryBudgets.find(
      (cb) =>
        cb.category.toString() === categoryId ||
        (categoryObj && cb.category.toString() === categoryObj._id.toString())
    );

    if (catBudget && catBudget.amount > 0) {
      // Find spent for this category
      // stats.categorySpent keys are the "category" field from transaction (which is usually Name string).
      // If transaction stores Name, then stats.categorySpent[categoryName] is the spent.

      const spent = stats.categorySpent[categoryName] || 0;
      console.log(
        `Category: ${categoryName}, Limit: ${catBudget.amount}, Spent: ${spent}`
      );

      if (spent > catBudget.amount) {
        const previousSpent = spent - amount;
        if (previousSpent <= catBudget.amount) {
          notifications.push({
            user: userId,
            title: "Category Budget Exceeded",
            message: `You have exceeded your budget for ${categoryName}. Limit: ${catBudget.amount}, Spent: ${spent}`,
            type: "budget",
          });
        }
      }
    }

    if (notifications.length > 0) {
      console.log("Creating notifications:", notifications);
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    console.error("Check Budget Exceeded Error:", error);
  }
};
