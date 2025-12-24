import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { initCronJobs } from "./src/services/cronService.js";

connectDB();

// Initialize Cron Jobs
initCronJobs();

const PORT = process.env.PORT || 5000;

// Debugging: Check critical environment variables
console.log("🚀 SERVER STARTING - VERSION: Contact-V8 (Fresh Rewrite 587)");
console.log("Starting server...");
console.log("Environment:", process.env.NODE_ENV);
console.log("MONGO_URI is set:", !!process.env.MONGO_URI);
console.log("JWT_SECRET is set:", !!process.env.JWT_SECRET);
console.log("CLIENT_URL is set:", !!process.env.CLIENT_URL);
console.log("CLIENT_URL value:", process.env.CLIENT_URL); // Log safe value to check for trailing slash issues

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
