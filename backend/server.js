import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { initCronJobs } from "./src/services/cronService.js";

connectDB();

// Initialize Cron Jobs
initCronJobs();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
