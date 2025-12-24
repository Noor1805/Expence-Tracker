import cron from "node-cron";
import { processRecurringTransactions } from "../jobs/recurringTransactionJob.js";

// Initialize all cron jobs
export const initCronJobs = () => {
  console.log("Initializing Cron Jobs...");

  // Schedule Recurring Transaction Job
  // Run every day at midnight (00:00)
  // For testing, you can change this to "* * * * *" (every minute)
  cron.schedule("0 0 * * *", async () => {
    console.log("Running Daily Cron Job: Recurring Transactions");
    try {
      await processRecurringTransactions();
    } catch (error) {
      console.error("Error in Recurring Transaction Job:", error);
    }
  });

  // Example: Run every hour
  /*
  cron.schedule("0 * * * *", () => {
      console.log("Running Hourly Job...");
  });
  */

  console.log("Cron Jobs Scheduled.");
};
