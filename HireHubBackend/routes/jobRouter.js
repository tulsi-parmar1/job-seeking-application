import express from "express";
import {
  deleteJob,
  getAllJob,
  getMyJobs,
  getSingleJob,
  postJob,
  updateJob,
  countCategories,
  latestJob,
  similarJobs,
} from "../controller/jobController.js";
import { jobsCountByType } from "../controller/jobController.js";
import { isLoggedin } from "../middleware/isLoggedIn.js";

const router = express.Router();

router.post("/postJob", isLoggedin, postJob);
router.get("/similarJobs/:id", similarJobs);
router.get("/latestJob", latestJob);
router.get("/countCategories", countCategories);
router.get("/getAll", getAllJob);

router.get("/jobtype", jobsCountByType);
router.get("/getMyJobs", isLoggedin, getMyJobs);
router.put("/updateJob/:id", isLoggedin, updateJob);
router.delete("/deleteJob/:id", isLoggedin, deleteJob);
router.get("/:id", getSingleJob);

export default router;
