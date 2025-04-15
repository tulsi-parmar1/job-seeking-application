import userModel from "../models/usermodel.js";
import bcrypt from "bcrypt";
import JobModel from "../models/jobModel.js";
import generateToken from "../utils/generateToken.js";
import { sendVerificationCode } from "../middleware/Email.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
const registeruser = async (req, res) => {
  try {
    let { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(401).json({ message: "Please fill all the info" });
    }
    if (phone.length !== 10) {
      return res
        .status(401)
        .json({ message: "Phone number must be 10 digits long" });
    }
    let existUser = await userModel.findOne({ email: email });
    if (existUser) {
      return res
        .status(401)
        .json({ message: "You already have an account, please login!" });
    }
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); //5minutes expiry

    bcrypt.genSalt(10, (err, salt) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Server error", error: err.message });

      bcrypt.hash(password, salt, async (err, hash) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Error hashing password", error: err.message });

        try {
          let newuser = await userModel.create({
            name,
            email,
            phone,
            password: hash,
            verificationCode: verificationCode,
            otpExpireAt: otpExpiry,
            isVerified: false,
          });

          await newuser.save();

          sendVerificationCode(email, verificationCode);
          let token = generateToken(newuser);
          const options = {
            expires: new Date(
              Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: true,
          };
          res.cookie("token", token, options);
          res.status(201).json({
            message: "User registered successfully",
            user: {
              _id: newuser._id,
              name: newuser.name,
              email: newuser.email,
              phone: newuser.phone,
            },
            token,
          });
        } catch (err) {
          if (err.name === "ValidationError") {
            const errors = Object.values(err.errors).map(
              (error) => error.message
            );
            return res.status(400).json({ errors });
          }
          res
            .status(500)
            .json({ message: "Server errorrr", error: err.message });
        }
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      return res.status(401).json({ message: "email not found" });
    }
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "user not exist!!!" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; //1h expiry
    await user.save();
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: '"HIREhub" <hirehub.verify@gmail.com>',
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below:</p>
                   <a href="${resetUrl}">${resetUrl}</a>
                   <p>This link is valid for 1 hour.</p>`,
    });

    res.status(200).json({ message: "reset link sent to your email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // Extract token from URL params
    const { newPassword, confirmNewPassword } = req.body;
    const isequal = newPassword === confirmNewPassword;
    if (!isequal) {
      return res
        .status(400)
        .json({ message: "password and confirm password are not same!" });
    }
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({ message: "password reset successfully " });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "server error", error });
  }
};
const loginuser = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).send({ message: "please fill all the info" });
  }
  let user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).send({ message: "Email or Password Incorect!" });
  }
  if (!user.isVerified) {
    return res
      .status(400)
      .json({ message: "Please verify your email before logging in." });
  }
  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      let token = generateToken(user);
      const options = {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true,
      };
      res.cookie("token", token, options);
      res.send({
        message: "you're logged in now.",
        user,
      });
    } else {
      return res.status(401).send({
        message: "email or password is incorrect",
      });
    }
  });
};
const logout = async (req, res) => {
  res.clearCookie("token");
  res.send("you are logged out");
};
export const getUser = async (req, res) => {
  const user = req.user;

  if (!user?.isVerified) {
    try {
      await userModel.deleteOne({ _id: user._id });
    } catch (error) {
      res.send({ message: "error  while deleting non-verified user" });
    }
  } else {
    res.json({
      message: "user is send",
      user,
      savedJobs: user?.savedJobs,
    });
  }
};
export const recruiterLogin = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).send({ message: "please fill all the info" });
  }
  let user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).send({ message: "Email or Password Incorect!" });
  }
  bcrypt.compare(password, user.password, async (err, result) => {
    if (result) {
      user.role = "recruiter";
      await user.save();
      res.status(201).send({
        message: "you logged in as recruiter",
        user,
      });
    } else {
      return res.status(401).send({
        message: "email or password is incorrect",
      });
    }
  });
};
// Backend: savedJobs function
export const savedJobs = async (req, res) => {
  const { userId, jobId } = req.params;
  try {
    const user = await userModel.findById(userId);
    const job = await JobModel.findById(jobId);
    if (!user || !job) {
      return res.status(404).json({ message: "User or Job not found" });
    }

    if (user.savedJobs.includes(jobId)) {
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
      await user.save();
      res.status(200).json({
        message: "Job removed from saved jobs",
        savedJobs: user.savedJobs,
      });
    } else {
      user.savedJobs.push(jobId);
      await user.save();
      res
        .status(200)
        .json({ message: "Job saved successfully", savedJobs: user.savedJobs });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.log("error");
  }
};
export const getSavedJobs = async (req, res) => {
  const id = req.user;
  try {
    const user = await userModel.findById(id);
    const savedJobsIds = user.savedJobs;
    const savedJobs = await JobModel.find({ _id: { $in: savedJobsIds } });
    res.json({
      savedJobs,
    });
  } catch (error) {
    console.log(error);
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await userModel.findOne({ verificationCode: code });

    // If user does not exist, return response and stop execution
    if (!user) {
      return res.status(400).json({ message: "Invalid otp" });
    }
    if (user.otpExpireAt < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }
    // Mark email as verified
    user.isVerified = true;
    user.verificationCode = undefined; // Remove verification code after successful verification
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("Error in verifying email:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
export const otpResend = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    user.verificationCode = otp;
    user.otpExpireAt = otpExpiry;
    await user.save();

    sendVerificationCode(email, otp);
    res.status(200).json({ message: "New OTP sent!" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const loginUser = loginuser;
export const registerUser = registeruser;
export const logoutUser = logout;
