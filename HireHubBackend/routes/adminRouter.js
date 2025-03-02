import express from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import { isLoggedin } from "../middleware/isLoggedIn.js";
import {
  deleteJob,
  deleteUser,
  getAdmin,
  getJobs,
  getMonthlyRegistrations,
  getUsers,
} from "../controller/adminController.js";
const router = express.Router();

router.get("/getUsers", isLoggedin, isAdmin, getUsers);
router.get("/get-jobs", isLoggedin, isAdmin, getJobs);
router.get("/getAdmin", isLoggedin, isAdmin, getAdmin);
router.get(
  "/getMonthlyRegistrations",
  isLoggedin,
  isAdmin,
  getMonthlyRegistrations
);
router.delete("/delete-user/:id", isLoggedin, isAdmin, deleteUser);
router.delete("delete-job/:id", isLoggedin, isAdmin, deleteJob);
export default router;
