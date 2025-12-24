import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error Details:", error);
    // Do not exit process in dev/prod immediately if we want to see logs,
    // but for a web server, crashing is usually better so it restarts.
    // However, let's ensure we see the log first.
    process.exit(1);
  }
};

export default connectDB;
