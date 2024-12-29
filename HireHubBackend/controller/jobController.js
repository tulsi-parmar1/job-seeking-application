import JobModel from "../models/jobModel.js";
import { v2 as cloudinary } from "cloudinary"; // Import cloudinary correctly
import ApplicationModel from "../models/applicationModel.js";

// export const getAllJob = async (req, res, next) => {
//   try {
//     const userId = req.user._id; // Get the logged-in user's ID
//     const skip = req.query.skip;
//     console.log(skip);
//     // Find all jobs where the `postedBy` field is not equal to the logged-in user's ID
//     const jobs = await JobModel.find(
//       {
//         deadline: false,
//         postedBy: { $ne: userId }, // Exclude jobs posted by the current user
//       },
//       { skip, limit: 5 }
//     ).sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       jobs,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch jobs",
//       error: error.message,
//     });
//   }
// };

// export const getAllJob = async (req, res, next) => {
//   try {
//     const { page, limit } = req.query; // Default to page 1 and limit 7
//     const skip = (page - 1) * limit;

//     const jobs = await JobModel.find({
//       deadline: false,
//       postedBy: { $ne: req.user._id }, // Exclude jobs posted by current user
//     })
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 });

//     const totalJobs = await JobModel.countDocuments({
//       deadline: false,
//       postedBy: { $ne: req.user._id },
//     });

//     res.status(200).json({
//       success: true,
//       jobs,
//       totalJobs,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch jobs",
//       error: error.message,
//     });
//   }
// };

export const getAllJob = async (req, res) => {
  const { page = 1, limit = 7 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const jobs = await JobModel.find()
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // Ensure proper sorting

    const totalJobs = await JobModel.countDocuments();
    res.status(200).json({ jobs, totalJobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const postJob = async (req, res) => {
  if (!req.user.role || req.user.role != "recruiter") {
    res.status(401).send({
      message: "only recruiter can post job",
    });
  }
  const {
    title,
    description,
    categories,
    company,
    location,
    employmentType,
    salaryRangeMin,
    salaryRangeMax,
    requirements,
    responsibilities,
    postedDate,
    deadline,
    contactEmail,
  } = req.body;
  if (!title || !description || !company || !location || !categories) {
    return res.status(401).json({
      success: false,
      message: "please provide full job details",
    });
  }
  const { logo } = req.files;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(402).send({ error: "upload a file" });
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    logo.tempFilePath,
    { folder: "HireHub" }
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    return res.status(500).json({ message: "Cloudinary upload error" });
  }
  const postedBy = req.user._id;
  const salaryRange = {
    min: parseFloat(salaryRangeMin),
    max: parseFloat(salaryRangeMax),
  };
  try {
    const job = await JobModel.create({
      title,
      description,
      categories,
      company,
      location,
      employmentType,
      salaryRange,
      requirements,
      responsibilities,
      postedDate,
      deadline,
      contactEmail,
      postedBy,
      logo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
    res.json({
      success: true,
      message: "job posted succesfully",
    });
  } catch (error) {
    res.status(403).send({
      message: "server error",
    });
    console.log(error);
  }
};
export const getMyJobs = async (req, res, next) => {
  const myjobs = await JobModel.find({ postedBy: req.user._id });
  res.send({ myjob: myjobs });
};
export const updateJob = async (req, res) => {
  const { id } = req.params;
  let job = await JobModel.findById(id);
  if (!job) {
    return res.status(401).send({
      message: "jobs are not found!",
    });
  }
  job = await JobModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.send({
    message: "updated succesfully",
  });
};
export const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    // First, delete the job
    const deletedJob = await JobModel.findById(id);

    // Check if the job was found and deleted
    if (!deletedJob) {
      return res.status(404).send({ message: "Job not found!" });
    }

    // Delete all applications related to this job
    const applicationsDeleted = await ApplicationModel.deleteMany({ job: id });
    await deletedJob.deleteOne();
    res.send({
      message: `Job and ${applicationsDeleted.length} applications are deleted.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "An error occurred while deleting the job.",
      error: error.message,
    });
  }
};
export const getSingleJob = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await JobModel.findById(id);
    if (!job) {
      return res.status(400).send({ message: "no jobs" });
    }
    const applicantsLength = job.applicants.length;
    res.status(200).json({
      applicantsLength,
      job,
    });
  } catch (error) {
    return res.status(400).send({ message: "invalid id or cast error" }); ///cast error means changing id]s characters
  }
};
export const similarJobs = async (req, res) => {
  const { id } = req.params;
  try {
    // Retrieve the job by its ID
    const job = await JobModel.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const { title } = job;
    const keywords = title.split(" ");
    const regexQueries = keywords.map((keyword) => ({
      title: new RegExp(keyword, "i"),
    }));

    const similarJobs = await JobModel.find({
      $and: [
        { _id: { $ne: id } },
        {
          $or: regexQueries,
        },
      ],
    });
    res.json(similarJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};
export const countCategories = async (req, res) => {
  try {
    const itJobs = await JobModel.find({
      categories: "Information Technology (IT)",
    });
    const healthcare = await JobModel.find({ categories: "Healthcare" });
    const education = await JobModel.find({ categories: "Education" });
    const hr = await JobModel.find({ categories: "Human Resources" });
    const ac = await JobModel.find({ categories: "Accountant" });
    const cs = await JobModel.find({ categories: "Customer Service" });
    res.send({
      itjobs: itJobs,
      itjobslength: itJobs.length,
      healthcare: healthcare,
      healthcarelength: healthcare.length,
      education: education,
      educationlength: education.length,
      hr: hr,
      hrlength: hr.length,
      ac: ac,
      aclength: ac.length,
      cs: cs,
      cslength: cs.length,
    });
  } catch (error) {
    res.status(201).send({
      message: "error occured in fetching category jobs",
      error,
    });
  }
};
export const latestJob = async (req, res) => {
  const user = req.user;
  const jobs = await JobModel.find({ postedBy: { $nin: [user._id] } })
    .sort({ createdAt: -1 }) // Sort by createdAt, latest first
    .limit(4) // Limit to 6 results
    .exec(); // Execute the query
  res.send(jobs);
};
export const jobsCountByType = async (req, res) => {
  try {
    const fullTime = await JobModel.find({ employmentType: "Full-time" });
    const partTime = await JobModel.find({ employmentType: "Part-time" });
    const contract = await JobModel.find({ employmentType: "Contract" });
    const internship = await JobModel.find({ employmentType: "Internship" });
    const remoteJob = await JobModel.find({ employmentType: "Remote Job" });
    res.send({
      fullTime,
      fullTimeLength: fullTime.length,
      partTime,
      partTimeLength: partTime.length,
      contract,
      contractLength: contract.length,
      internship,
      internshipLength: internship.length,
      remoteJob,
      remoteJobLength: remoteJob.length,
    });
  } catch (error) {
    res.status(201).send({
      message: "error occured in fetching type jobs",
      error,
    });
  }
};
