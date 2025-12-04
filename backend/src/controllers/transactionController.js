import cloudinary from "../config/cloudinary.js";
import Transaction from "../models/Transaction.js";
import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import csv from "csvtojson";

export const createTransaction = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }


        const {
            amount,
            type,
            category,
            paymentMethod,
            date,
            note,
            isRecurring,
            recurringFrequency,
        } = req.body;


        const transaction = await Transaction.create({
            user: req.user.id,
            amount,
            type,
            category,
            paymentMethod,
            date,
            note,
            isRecurring,
            recurringFrequency,
        });


        return res.status(201).json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        console.error("Create Transaction Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const getTransactions = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            type,
            category,
            paymentMethod,
            startDate,
            endDate,
            search,
            page = 1,
            limit = 10,
            sort = "desc"
        } = req.query;

        const query = { user: userId };

        if (type) query.type = type;
        if (category) query.category = category;
        if (paymentMethod) query.paymentMethod = paymentMethod;
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        if (search) {
            query.note = { $regex: search, $options: "i" };
        }

        const skip = (page - 1) * limit;

        const sortOptions = sort === "desc" ? 1 : -1;

        const transactions = await Transaction.find(query).sort({ date: sortOptions }).skip(skip).limit(limit);

        return res.status(200).json({
            success: true,
            data: transactions,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        console.error("Get Transactions Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const getTransactionById = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactionId = req.params.id;

        const transaction = await Transaction.findOne({
            _id: transactionId,
            user: userId
        })

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            })
        }

        return res.status(200).json({
            success: true,
            data: transaction,
        })
    } catch (error) {
        console.error("Get Transaction By Id Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

export const updateTransaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactionId = req.params.id;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            })
        }

        const transaction = await Transaction.findOne({
            _id: transactionId,
            user: userId
        })

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            })
        }

        const {
            amount,
            type,
            category,
            paymentMethod,
            date,
            note,
            isRecurring,
            recurringFrequency,
        } = req.body;

        // Update the fields
        transaction.amount = amount;
        transaction.type = type;
        transaction.category = category;
        transaction.paymentMethod = paymentMethod;
        transaction.date = date;
        transaction.note = note;
        transaction.isRecurring = isRecurring;
        transaction.recurringFrequency = recurringFrequency;

        await transaction.save();

        return res.status(200).json({
            success: true,
            data: transaction,
            message: "Transaction updated successfully",
        });
    } catch (error) {
        console.error("Update Transaction Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

export const deleteTransaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactionId = req.params.id;

        // 1. Find transaction (only user's)
        const transaction = await Transaction.findOne({
            _id: transactionId,
            user: userId
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        // 2. Delete
        await transaction.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Transaction deleted successfully"
        });

    } catch (error) {
        console.error("Delete Transaction Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const uploadReceipt = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactionId = req.params.id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const transaction = await Transaction.findOne({
            _id: transactionId,
            user: userId,
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }


        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "expense-tracker/receipts",
                public_id: uuidv4(),
                resource_type: "image",
            },
            async (error, result) => {
                if (error) {
                    console.error("Cloudinary Error:", error);
                    return res.status(500).json({
                        success: false,
                        message: "Cloudinary upload failed",
                    });
                }


                transaction.receiptUrl = result.secure_url;
                await transaction.save();

                return res.status(200).json({
                    success: true,
                    message: "Receipt uploaded successfully",
                    url: result.secure_url,
                });
            }
        );

        uploadStream.end(req.file.buffer);

    } catch (error) {
        console.error("Upload Receipt Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const bulkDeleteTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "transaction IDs are required",
            });
        }

        const result = await Transaction.deleteMany({
            _id: { $in: ids },
            user: userId,
        });

        return res.status(200).json({
            success: true,
            message: `${result.deletedCount} Transactions deleted successfully`,
        });
    } catch (error) {
        console.error("Bulk Delete Transactions Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const getTotalStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const transactions = await Transaction.find({ user: userId });

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach((t) => {
            if (t.type === "income") {
                totalIncome += t.amount;
            } else if (t.type === "expense") {
                totalExpense += t.amount;
            }
        });

        const balance = totalIncome - totalExpense;

        const savingsPercentage =
            totalIncome === 0 ? 0 : ((balance / totalIncome) * 100).toFixed(2);

        return res.status(200).json({
            success: true,
            totalIncome,
            totalExpense,
            balance,
            savingsPercentage,
        });

    } catch (error) {
        console.error("Stats Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getCategoryStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const transactions = await Transaction.find({ user: userId });

        const categoryTotal = {};

        transactions.forEach((t) => {
            if (!categoryTotal[t.category]) {
                categoryTotal[t.category] = 0;
            }
            categoryTotal[t.category] += t.amount;
        });

        return res.status(200).json({
            success: true,
            data: categoryTotal,
        });


    } catch (error) {
        console.error("Category Stats Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getMonthlyStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const transactions = await Transaction.find({ user: userId });

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const stats = months.map((month, index) => ({
            month,
            income: 0,
            expense: 0,
        }));

        transactions.forEach((t) => {
            const monthIndex = t.date.getMonth();

            if (t.type === "income") {
                stats[monthIndex].income += t.amount;
            } else if (t.type === "expense") {
                stats[monthIndex].expense += t.amount;
            }
        });

        return res.status(200).json({
            success: true,
            data: stats,
        });

    } catch (error) {
        console.error("Monthly Stats Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getPaymentMethodStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const transactions = await Transaction.find({ user: userId });

        const methodTotals = {};

        transactions.forEach((t) => {
            if (!methodTotals[t.paymentMethod]) {
                methodTotals[t.paymentMethod] = 0;
            }
            methodTotals[t.paymentMethod] += t.amount;
        });

        return res.status(200).json({
            success: true,
            data: methodTotals,
        });
    } catch (error) {
        console.error("Payment Method Stats Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getRecentTransactions = async (req, res) => {
    try {
        const userId = req.user.id;

        const recent = await Transaction.find({ user: userId })
            .sort({ date: -1 })
            .limit(5);

        return res.status(200).json({
            success: true,
            data: recent,
        });

    } catch (error) {
        console.error("Recent Transactions Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const exportCSV = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactions = await Transaction.find({ user: userId });

        if (transactions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No transactions found",
            });
        }

        const data = transactions.map((t) => ({
            id: t._id,
            type: t.type,
            category: t.category,
            amount: t.amount,
            paymentMethod: t.paymentMethod,
            date: t.date,
            notes: t.notes || "",
            receiptUrl: t.receiptUrl || "",
        }));

        const parser = new Parser();
        const csv = parser.parse(data);

        res.header("Content-Type", "text/csv");
        res.attachment("transactions.csv");
        res.send(csv);

    } catch (error) {
        console.error("Export CSV Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}


export const exportPDF = async (req, res) => {
    try {
        const userId = req.user.id;

        const transactions = await Transaction.find({ user: userId });

        if (transactions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No transactions found to export",
            });
        }

        const doc = new PDFDocument({ margin: 40 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=transactions.pdf");

        doc.pipe(res);

        doc.fontSize(20).text("Expense Tracker - Transactions Report", { align: "center" });
        doc.moveDown();

        doc.fontSize(12).text("Type", 40, doc.y, { width: 100 });
        doc.text("Category", 120, doc.y, { width: 120 });
        doc.text("Amount", 240, doc.y, { width: 100 });
        doc.text("Payment", 310, doc.y, { width: 100 });
        doc.text("Date", 380, doc.y, { width: 150 });
        doc.moveDown();

        doc.moveDown();


        transactions.forEach((t) => {
            doc.fontSize(10);

            doc.text(t.type, 40, doc.y, { width: 100 });
            doc.text(t.category, 120, doc.y, { width: 120 });
            doc.text(t.amount.toString(), 240, doc.y, { width: 100 });
            doc.text(t.paymentMethod, 310, doc.y, { width: 100 });
            doc.text(t.date.toISOString().split("T")[0], 380, doc.y, { width: 150 });

            doc.moveDown();
            doc.moveDown();
        });

        doc.end();

    } catch (error) {
        console.error("PDF Export Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const recurringTransactionHandler = async (req, res) => {
    try {
        const userId = req.user.id;
        const recurringTransactions = await Transaction.find({ user: userId, recurringFrequency: { $ne: none } });

        if (recurringTransactions.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No recurring transactions found",
            });
        }

        const autoAdded = [];

        for (let t of recurringTransactions) {
            const currentDate = new Date();
            const lastDate = new Date(t.date);

            let shouldAdd = false;

            if (t.recurringFrequency === "daily") {
                shouldAdd = currentDate.getDate() !== lastDate.getDate();
            } else if (t.recurringFrequency === "weekly") {
                shouldAdd = (currentDate - lastDate) / (1000 * 60 * 60 * 24) >= 7;
            } else if (t.recurringFrequency === "monthly") {
                shouldAdd = currentDate.getMonth() !== lastDate.getMonth() || currentDate.getFullYear() !== lastDate.getFullYear();
            } else if (t.recurringFrequency === "yearly") {
                shouldAdd = currentDate.getFullYear() !== lastDate.getFullYear();
            }



            if (shouldAdd) {
                const newTransaction = await Transaction.create({
                    user: t.user,
                    type: t.type,
                    category: t.category,
                    amount: t.amount,
                    paymentMethod: t.paymentMethod,
                    notes: t.notes,
                    date: currentDate,
                    recurringFrequency: t.recurringFrequency,
                });

                autoAdded.push(newTransaction);
            }
        }

    } catch (error) {
        console.error("Recurring Transaction Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const clearAllTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        await Transaction.deleteMany({ user: userId });
        return res.status(200).json({
            success: true,
            message: "All transactions cleared successfully",
        });
    } catch (error) {
        console.error("Clear All Transactions Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const importTransactions = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No CSV file uploaded",
            });
        }

        const transactionsArray = await csv().fromString(
            req.file.buffer.toString()
        );

        if (transactionsArray.length === 0) {
            return res.status(400).json({
                success: false,
                message: "CSV file is empty",
            });
        }

        const formattedData = transactionsArray.map((row) => ({
            user: userId,
            type: row.type,
            category: row.category,
            amount: Number(row.amount),
            paymentMethod: row.paymentMethod,
            date: new Date(row.date),
            notes: row.notes || "",
            recurringFrequency: row.recurringFrequency || "none",
        }));

        const result = await Transaction.insertMany(formattedData);

        return res.status(200).json({
            success: true,
            message: `${result.length} transactions imported successfully`,
        });

    } catch (error) {
        console.error("Import Transactions Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const duplicateTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactionId = req.params.id;

        const original = await Transaction.findOne({ _id: transactionId, user: userId });
        if (!original) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }
        const newTransaction = await Transaction.create({
            user: userId,
            type: original.type,
            category: original.category,
            amount: original.amount,
            paymentMethod: original.paymentMethod,
            notes: original.notes,
            date: new Date(),
            recurringFrequency: original.recurringFrequency,
        });

        return res.status(200).json({
            success: true,
            message: "Transaction duplicated successfully",
            data: newTransaction,
        });
    } catch (error) {
        console.error("Duplicate Transactions Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}