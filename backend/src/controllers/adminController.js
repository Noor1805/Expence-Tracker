import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password -refreshToken");
        res.status(200).json({ success: true, users, count: users.length });
    } catch (error) {
        console.log("Get all users error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;


        const user = await User.findById(userId).select("-password -refreshTokens");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }


        const transactions = await Transaction.find({ user: userId });


        const totalIncome = transactions
            .filter(t => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);


        const totalExpense = transactions
            .filter(t => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);


        const categories = await Category.find({ user: userId });

        return res.status(200).json({
            success: true,
            user,
            stats: {
                totalTransactions: transactions.length,
                totalIncome,
                totalExpense,
                categoriesCount: categories.length,
            },
        });

    } catch (error) {
        console.error("Get User Details Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }


        await Transaction.deleteMany({ user: userId });


        await Category.deleteMany({ user: userId });
        await Budget.deleteMany({ user: userId });


        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "User and all related data deleted successfully",
        });

    } catch (error) {
        console.error("Delete User Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const toggleBlockUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.isBlocked = !user.isBlocked;

        await user.save();

        return res.status(200).json({
            success: true,
            message: `User has been ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
            isBlocked: user.isBlocked,
        });

    } catch (error) {
        console.error("Toggle Block User Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const promoteToAdmin = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.role === "admin") {
            return res.status(400).json({
                success: false,
                message: "User is already an admin",
            });
        }

        user.role = "admin";
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User promoted to admin successfully",
            role: user.role,
        });

    } catch (error) {
        console.error("Promote User Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getAppStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isBlocked: false });
        const blockedUsers = await User.countDocuments({ isBlocked: true });
        const totalTransactions = await Transaction.countDocuments();
        const totalBudget = await Budget.countDocuments();
        const totalIncome = await Transaction.aggregate([
            {
                $match: { type: "income" }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        const totalExpense = await Transaction.aggregate([
            {
                $match: { type: "expense" }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        const totalCategories = await Category.countDocuments();

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                activeUsers,
                blockedUsers,
                totalTransactions,
                totalBudget,
                totalIncome: totalIncome[0]?.total || 0,
                totalExpense: totalExpense[0]?.total || 0,
                totalCategories,
            },
        });
    } catch (error) {
        console.error("Get App Stats Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}