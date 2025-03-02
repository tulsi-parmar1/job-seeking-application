import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  recruiterLogin,
  verifyEmail,
  savedJobs,
  getSavedJobs,
  otpResend,
  forgotPassword,
  resetPassword,
} from "../controller/authController.js";
import { isLoggedin } from "../middleware/isLoggedIn.js";
const router = express.Router();

router.get("/getSavedJobs/:id", isLoggedin, getSavedJobs);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("recruiterLogin", recruiterLogin);
router.get("/logout", logoutUser);
router.post("/recruiterLogin", recruiterLogin);
router.get("/getUser", isLoggedin, getUser);
router.post("/savedJobs/:userId/:jobId", isLoggedin, savedJobs);
router.post("/varifyEmail", verifyEmail);
router.post("/otpResend", otpResend);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
export default router;
