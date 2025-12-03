import mongoose from "mongoose";
import crypto from "crypto";
import { type } from "os";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
    role:{
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    currency:{
        type: String,
        default: "INR",
    },
    refreshTokens:[{
        token: String,
        createdAt: Date,
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true
})


userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken = resetToken;
    this.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model("User", userSchema);
export default User;
