import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    color: {
      type: String,
      default: "#6c5ce7",
    },

    icon: {
      type: String,
      default: "📁",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
