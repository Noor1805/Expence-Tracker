import mongoose from "mongoose";
import dotenv from "dotenv";
import Budget from "./src/models/Budget.js";
import Category from "./src/models/Category.js";
import Transaction from "./src/models/Transaction.js";
import User from "./src/models/User.js";

// Explicitly point to .env
dotenv.config({ path: "./.env" });

const debug = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log("MONGO_URI Loaded:", uri ? "Yes" : "No");
    if (uri) console.log("MONGO_URI Base:", uri.split("?")[0]); // Safe log

    if (!uri) {
      console.error("EXITING: No Mongo URI");
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("Connected to DB successfully");

    const userCount = await User.countDocuments();
    console.log(`Total Users: ${userCount}`);

    const user = await User.findOne();
    if (!user) {
      console.log("No user found! DB might be empty or wrong.");
      return;
    }
    console.log(`Using User: ${user.name} (${user._id})`);

    const categories = await Category.find({ user: user._id });
    console.log(`Categories Found for user: ${categories.length}`);
    categories.forEach((c) => console.log(` - ${c.name} (${c._id})`));

    const now = new Date();
    // Check 'date' of budget vs transaction
    // Let's look for ANY budget
    const budgets = await Budget.find({ user: user._id });
    console.log(`Total Budgets Found: ${budgets.length}`);
    budgets.forEach((b) => {
      console.log(
        ` Budget: ${b.month}/${b.year} - Items: ${b.categoryBudgets.length}`
      );
      b.categoryBudgets.forEach((cb) =>
        console.log(`   -> CatID: ${cb.category}, Limit: ${cb.amount}`)
      );
    });
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    mongoose.disconnect();
  }
};

debug();
