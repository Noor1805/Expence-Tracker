import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";
import {
  budgetSchema,
  budgetUpdateSchema,
} from "../validations/budgetValidation.js";

export const setBudget = async (req, res) => {
  try {
    const userId = req.user.id;

    const { error } = budgetSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { overallBudget, categoryBudgets, month, year } = req.body;

    const existingBudget = await Budget.findOne({ user: userId, month, year });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message: "Budget already exists for this month and year",
      });
    }

    const budget = await Budget.create({
      user: userId,
      overallBudget: overallBudget || 0,
      categoryBudgets: categoryBudgets || [],
      month,
      year,
    });

    return res.status(201).json({
      success: true,
      message: "Budget created successfully",
      data: budget,
    });
  } catch (error) {
    console.error("Set Budget Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const setCategoryLimit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, limit } = req.body;

    if (!category || !limit) {
      return res
        .status(400)
        .json({ success: false, message: "Category and Limit are required" });
    }

    let categoryId = category;

    if (!mongoose.Types.ObjectId.isValid(category)) {
      const catDoc = await Category.findOne({
        name: { $regex: new RegExp(`^${category}$`, "i") },
        user: userId,
      });

      if (!catDoc) {
        return res
          .status(404)
          .json({
            success: false,
            message: `Category '${category}' not found. Please create it first.`,
          });
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

    budget.overallBudget = budget.categoryBudgets.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    await budget.save();

    return res.status(200).json({
      success: true,
      message: "Budget set successfully",
      data: budget,
    });
  } catch (error) {
    console.error("Set Category Budget Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getBudgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const budget = await Budget.findOne({ user: userId, month, year });

    if (!budget) {
      return res.status(200).json({ success: true, data: [] });
    }

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
    const categoryMap = {}; // Map ID -> Category Doc

    categoriesDb.forEach((c) => {
      categoryMap[c._id.toString()] = c;
    });

    const result = budget.categoryBudgets.map((cb) => {
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

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get Budgets Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getBudgetStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required",
      });
    }

    const budget = await Budget.findOne({ user: userId, month, year });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "No budget found for this month",
      });
    }

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

    const percentageUsed =
      budget.overallBudget > 0 ? (totalSpent / budget.overallBudget) * 100 : 0;

    return res.status(200).json({
      success: true,
      data: {
        overallBudget: budget.overallBudget,
        categoryBudgets: budget.categoryBudgets,
        totalSpent,
        remainingBudget,
        percentageUsed,
        exceeded: totalSpent > budget.overallBudget,
        categorySpent,
      },
    });
  } catch (error) {
    console.error("Get Budget Stats Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetId = req.params.id;

    const { error } = budgetUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { overallBudget, categoryBudgets } = req.body;

    const budget = await Budget.findOne({ _id: budgetId, user: userId });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    if (overallBudget !== undefined) {
      budget.overallBudget = overallBudget;
    }

    if (categoryBudgets !== undefined) {
      budget.categoryBudgets = categoryBudgets;
    }

    await budget.save();

    return res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      data: budget,
    });
  } catch (error) {
    console.error("Update Budget Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetItemId = req.params.id;

    const budget = await Budget.findOne({
      "categoryBudgets._id": budgetItemId,
      user: userId,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget item not found",
      });
    }

    const originalLength = budget.categoryBudgets.length;
    budget.categoryBudgets = budget.categoryBudgets.filter(
      (cb) => cb._id.toString() !== budgetItemId
    );

    if (budget.categoryBudgets.length === originalLength) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in budget error" });
    }

    budget.overallBudget = budget.categoryBudgets.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    await budget.save();

    return res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("Delete Budget Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
