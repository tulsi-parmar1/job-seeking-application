import express from "express";
import { getInfo, getProfile, postInfo, profileChange } from "../controller/profileController.js";
import { isLoggedin } from "../middleware/isLoggedIn.js";
const router=express.Router();

router.post('/postInfo',isLoggedin,postInfo);
router.get('/getInfo',isLoggedin,getInfo);
router.post('/profileChange',isLoggedin,profileChange);
router.get('/getProfile',isLoggedin,getProfile);
export default router;