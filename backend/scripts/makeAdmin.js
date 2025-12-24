import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const makeAdmin = async () => {
  const email = process.argv[2];

  if (!email) {
    console.error("Please provide an email address.");
    console.log("Usage: node scripts/makeAdmin.js <email>");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });

    if (!user) {
      console.error(`User not found with email: ${email}`);
      console.log("--- USERS ---");
      const users = await User.find().limit(10).select("email");
      users.forEach((u) => console.log(u.email));
      console.log("-------------");
      process.exit(1);
    }

    user.role = "admin";
    await user.save();

    console.log(`Success! User ${user.name} (${user.email}) is now an Admin.`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

makeAdmin();
