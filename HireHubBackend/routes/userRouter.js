import express from "express";
import {registerUser,loginUser,logoutUser,getUser, recruiterLogin, savedJobs, getSavedJobs} from "../controller/authController.js";
import { isLoggedin } from "../middleware/isLoggedIn.js";
const router = express.Router();

router.get('/getSavedJobs/:id',isLoggedin,getSavedJobs);
router.post('/register',registerUser)
router.post('/login', loginUser)
router.post('recruiterLogin',recruiterLogin);
router.get('/logout',logoutUser);
router.post('/recruiterLogin',isLoggedin,recruiterLogin)
router.get('/getUser',isLoggedin,getUser);
router.post('/savedJobs/:userId/:jobId',isLoggedin,savedJobs);


export default router;
