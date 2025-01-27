import ApplicationModel from "../models/applicationModel.js";
import JobModel from "../models/jobModel.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config({ path: "HireHub/config/config.env" });
export const getMyApplication = async (req, res) => {
  try {
    const { _id } = req.user;

    // Fetch applications with the associated job details
    const applications = await ApplicationModel.find({
      applicant: _id,
    }).populate("job"); // Assuming 'job' is the reference field to the JobModel

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};
export const postApplication = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      currentCity,
      contactNumber,
      email,
      coverLetter,
    } = req.body;

    if (!req.files || !req.files.resume) {
      return res.status(400).send("No resume file was uploaded.");
    }

    const resumeFile = req.files.resume;

    if (resumeFile.mimetype !== "application/pdf") {
      return res.status(400).send("Only PDF files are allowed.");
    }

    const uniqueFileName = `${Date.now()}-${resumeFile.name}`;
    const uploadPath = `./uploads/${uniqueFileName}`;

    await resumeFile.mv(uploadPath);

    const jobId = req.params.id;
    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).send("Job not found");
    }

    const employerId = job.postedBy;

    if (!employerId) {
      return res.status(404).send("Employer not found");
    }

    const applicant = req.user._id;

    const application = new ApplicationModel({
      job: job._id,
      applicant,
      resume: uploadPath,
      coverLetter,
      firstName,
      lastName,
      contactNumber,
      currentCity,
      email,
    });

    await application.save();
    job.applicants.push(application._id);
    await job.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send(error.message || "An error occurred");
  }
};
export const deleteApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const application = await ApplicationModel.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    //specific job
    const job = await JobModel.findById(application.job);
    console.log(job);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    console.log("Applicants before update:", job.applicants);

    const updatedApplicants = job.applicants.filter(
      (applicantId) => applicantId != id
    );
    console.log(updatedApplicants);
    // Attempt to remove the application ID from the applicants array
    const updateResult = await JobModel.updateOne(
      { _id: job._id },
      { $set: { applicants: updatedApplicants } }
    );
    await job.save();
    console.log("Update result:", updateResult);
    await ApplicationModel.findByIdAndDelete(id);

    res.json({ message: "Application deleted successfully!" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
export const getApplicantsForJob = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await JobModel.findById(id);
    console.log(job);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!job.applicants || job.applicants.length === 0) {
      return res.status(404).json({ message: "No applicants for this job" });
    }

    const applications = await ApplicationModel.find({
      job: job._id,
      applicant: { $in: job.applicants },
    });

    const applicantDetails = applications.map((application) => ({
      _id: application._id,
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      contactNumber: application.contactNumber,
      currentCity: application.currentCity,
      coverLetter: application.coverLetter,
      resume: `http://localhost:4000/${application.resume}`, // Assuming you have resume URL or file name
    }));
    console.log(applicantDetails.resume);
    // Send the response with the applicant details
    res.status(200).json({ applicants: applicantDetails });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
