import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  employmentType: {
    type: String,
    required: true, // e.g., Full-time, Part-time, Contract, Internship
    enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote Job"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  salaryRange: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  requirements: {
    type: String,
    required: true,
  },
  responsibilities: {
    type: String,
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  categories: {
    type: String,
    required: true,
    enum: [
      "Information Technology (IT)",
      "Healthcare",
      "Education",
      "Human Resources",
      "Accountant",
      "Customer Service",
    ],
  },
  deadline: {
    type: Boolean,
  },
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
  contactEmail: {
    type: String,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  logo: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  // qualification: {
  //   type: String,
  //   require: true,
  // },
});
const JobModel = mongoose.model("Job", jobSchema);
export default JobModel;
