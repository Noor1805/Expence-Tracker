import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },

    currency: {
      type: String,
      default: "INR",
    },

    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },

    language: {
      type: String,
      default: "en",
    },

    monthlyGoal: {
      type: Number,
      default: 0,
    },

    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
