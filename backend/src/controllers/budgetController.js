import * as budgetService from "../services/budgetService.js";
import {
  budgetSchema,
  budgetUpdateSchema,
} from "../validations/budgetValidation.js";

export const setBudget = async (req, res) => {
  try {
    const { error } = budgetSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const budget = await budgetService.createBudget(req.user.id, req.body);
      return res.status(201).json({
        success: true,
        message: "Budget created successfully",
        data: budget,
      });
    } catch (err) {
      if (err.message === "Budget already exists for this month and year") {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      throw err;
    }
  } catch (error) {
    console.error("Set Budget Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const setCategoryLimit = async (req, res) => {
  try {
    const { category, limit } = req.body;

    if (!category || !limit) {
      return res
        .status(400)
        .json({ success: false, message: "Category and Limit are required" });
    }

    try {
      const budget = await budgetService.upsertCategoryBudget(
        req.user.id,
        category,
        limit
      );
      return res.status(200).json({
        success: true,
        message: "Budget set successfully",
        data: budget,
      });
    } catch (err) {
      if (err.message.includes("not found")) {
        return res.status(404).json({
          success: false,
          message: err.message,
        });
      }
      throw err;
    }
  } catch (error) {
    console.error("Set Category Budget Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getBudgets = async (req, res) => {
  try {
    const result = await budgetService.getBudgetsWithSpent(req.user.id);
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
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required",
      });
    }

    const stats = await budgetService.getBudgetStats(req.user.id, month, year);

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: "No budget found for this month",
      });
    }

    return res.status(200).json({
      success: true,
      data: stats,
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
    const { error } = budgetUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const budget = await budgetService.updateBudget(
      req.params.id,
      req.user.id,
      req.body
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

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
    try {
      const budget = await budgetService.removeCategoryFromBudget(
        req.params.id,
        req.user.id
      );

      if (!budget) {
        return res.status(404).json({
          success: false,
          message: "Budget item not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Budget deleted successfully",
      });
    } catch (err) {
      if (err.message === "Item not found in budget error") {
        return res
          .status(404)
          .json({ success: false, message: "Item not found in budget error" });
      }
      throw err;
    }
  } catch (error) {
    console.error("Delete Budget Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
