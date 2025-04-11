import mongoose from "mongoose";
import validator from "validator";
const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  resume: {
    type: String,
    required: true,
  },
  coverLetter: {
    type: String,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  contactNumber: {
    type: Number,
    require: true,
  },
  currentCity: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: [true, "please enter your email!"],
    validate: [validator.isEmail, "please enter valid Email!"],
  },
});

const ApplicationModel = mongoose.model("Application", applicationSchema);

export default ApplicationModel;
