import userModel from "../models/usermodel.js";
import bcrypt from "bcrypt";
import JobModel from "../models/jobModel.js";
import generateToken from "../utils/generateToken.js";
const registeruser = async (req, res) => {
  try {
    let { name, email, phone, password } = req.body;
    if ((!name || !email || !phone, !password)) {
      return res.status(401).send({ message: "please fill all the info" });
    }
    if (phone.length != 10) {
      return res
        .status(401)
        .send({ message: "phone number must be 10 character long" });
    }
    let existUser = await userModel.findOne({ email: email });
    if (existUser) {
      return res.status(401).send({
        message: "you already have account please Login!",
      });
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) res.send(err.message);
        try {
          let newuser = await userModel.create({
            name,
            email,
            phone,
            password: hash,
          });
          let token = generateToken(newuser);
          res.cookie("token", token);
          res.send({ message: "User registered successfully" });
        } catch (err) {
          //mongoose error--------------->
          if (err.name === "ValidationError") {
            const errors = Object.values(err.errors).map(
              (error) => error.message
            );
            return res.status(400).json({ errors });
          }
          res.status(500).send({ message: "Server error" });
        }
      });
    });
  } catch (err) {
    res.status(500).send({ message: "Server error" });
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
  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token);
      res.send({
        message: "you can login",
      });
    } else {
      return res.status(401).send({
        message: "email or password is incorrect",
      });
    }
  });
};
const logout = async (req, res) => {
  res.cookie("token", "");
  res.send("you are logged out");
};
export const getUser = async (req, res) => {
  const user = req.user;
  res.json({
    message: "user is send",
    user,
    savedJobs: user.savedJobs,
  });
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
export const loginUser = loginuser;
export const registerUser = registeruser;
export const logoutUser = logout;
