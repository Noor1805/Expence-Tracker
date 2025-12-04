import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [1, "Amount must be greater than 0"]
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: [true, "Transaction type is required"]
    },
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "card", "upi", "net banking", "others"],
        default: "others",
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
    },
    note: {
        type: String,
        maxlength: 200
    },
    receiptUrl: {
        type: String
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringFrequency: {
        type: String,
        enum: ["none", "daily", "weekly", "monthly", "yearly"],
        default: "none"
    },
},
  {timestamps: true}
);

export default mongoose.model("Transaction", transactionSchema);