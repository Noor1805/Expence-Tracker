import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";

export const createBudget = async (req, res) => {
    try {
        const userId = req.user.id;
        const { overallBudget, categoryBudgets, month, year } = req.body;

        if (!month || !year) {
            return res.status(400).json({ message: "Month and year are required" });
        }

        let existingBudget = await Budget.findOne({ user: userId, month, year });
        if (existingBudget) {
            return res.status(400).json({ message: "Budget already exists for this month and year" });
        }

        const budget = await Budget.create({
            user: userId,
            overallBudget: overallBudget || 0,
            categoryBudgets: categoryBudgets || [],
            month,
            year
        });

        return res.status(201).json({
            success: true,
            message: "Budget created successfully",
            data: budget,
        })
    } catch (error) {
        console.error("Set Budget Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

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

        const budget = await Budget.findOne({
            user: userId,
            month,
            year,
        });

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
            budget.overallBudget > 0
                ? (totalSpent / budget.overallBudget) * 100
                : 0;

        const exceeded = totalSpent > budget.overallBudget;

        return res.status(200).json({
            success: true,
            data: {
                overallBudget: budget.overallBudget,
                categoryBudgets: budget.categoryBudgets,
                totalSpent,
                remainingBudget,
                percentageUsed,
                exceeded,
                categorySpent,
            },
        });

    } catch (error) {
        console.error("Get Budget Stats Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const updateBudget = async (req, res) => {
    try {
        const userId = req.user.id;
        const budgetId = req.params.id;
        const { overallBudget, categoryBudgets } = req.body;

        const budget = await Budget.findOne({
            _id: budgetId,
            user: userId,
        });

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
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const deleteBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetId = req.params.id;

   
    const deletedBudget = await Budget.findOneAndDelete({
      _id: budgetId,
      user: userId,
    });

    if (!deletedBudget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

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

