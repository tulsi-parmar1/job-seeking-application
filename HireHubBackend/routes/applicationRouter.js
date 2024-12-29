import express from "express";
import {
  deleteApplication,
  getApplicantsForJob,
  getMyApplication,
  postApplication,
} from "../controller/applicationController.js";

import { isLoggedin } from "../middleware/isLoggedIn.js";
const router = express.Router();
router.post("/postApplication/:id", isLoggedin, postApplication);
router.get("/getMyApplication", isLoggedin, getMyApplication);
router.get("/getApplication/:id", isLoggedin, getApplicantsForJob);
router.delete("/deleteApplication/:id", isLoggedin, deleteApplication);

export default router;
