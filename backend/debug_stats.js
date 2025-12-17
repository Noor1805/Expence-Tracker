import mongoose from "mongoose";
import dotenv from "dotenv";
import Transaction from "./src/models/Transaction.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const sampleTx = await Transaction.findOne();
    if (!sampleTx) {
      console.log("No transactions found.");
      return;
    }

    const userId = sampleTx.user;
    console.log("User ID:", userId);

    const txs = await Transaction.find({ user: userId });
    console.log("Transactions found:", txs.length);
    txs.forEach((t, i) => {
      console.log(
        `[${i}] Type: '${t.type}', Amount: ${t.amount}, Category: ${t.category}`
      );
    });

    const stats = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
    ]);
    console.log("Aggregation Result:", stats);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
