import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "please Enter Your Name!"],
    minLength: [2, "name must contain atleast 2 characters"],
    maxLength: [30, "name can not exceed 30 character"],
  },
  email: {
    type: String,
    require: [true, "please enter your email!"],
    validate: [validator.isEmail, "please enter valid Email!"],
  },
  phone: {
    type: Number,
    require: [true, "please enter your Phone-Number"],
  },

  savedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  password: {
    type: String,
    require: [true, "plase enter your Password"],
    minLength: [6, "password must contain atleast 6 characters"],
    maxLength: [80, "password can not exceed 10 character"],
  },
  role: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
  },
  verificationCode: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otpExpireAt: {
    type: Date,
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

const userModel = mongoose.model("user", userSchema);
export default userModel;
