import ApplicationModel from "../models/applicationModel.js";
import JobModel from "../models/jobModel.js"; // Make sure this import is correct
import dotenv from "dotenv";
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

    // Check if the file is present
    if (!req.files || !req.files.resume) {
      return res.status(400).send("No resume file was uploaded.");
    }

    const resumeFile = req.files.resume;

    // Check if the uploaded file is a PDF
    if (resumeFile.mimetype !== "application/pdf") {
      return res.status(400).send("Only PDF files are allowed.");
    }

    // Move the PDF file to the desired location
    const uniqueFileName = `${Date.now()}-${resumeFile.name}`;
    const uploadPath = `./uploads/${uniqueFileName}`;

    // Use promise-based method for file moving to avoid callback issues
    await resumeFile.mv(uploadPath);

    // Save the filename for database reference
    const resumeName = resumeFile.name;

    // Fetch job ID and validate if the job exists
    const jobId = req.params.id;
    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).send("Job not found");
    }

    const employerId = job.postedBy;

    // Ensure the employer exists
    if (!employerId) {
      return res.status(404).send("Employer not found");
    }

    // Retrieve applicant (user who is applying)
    const applicant = req.user._id;
    // Create a new application
    const application = new ApplicationModel({
      job: job._id,
      applicant,
      resume: resumeName, // Save the resume name in DB
      coverLetter,
      firstName,
      lastName,
      contactNumber,
      currentCity,
      email,
    });

    // Save the application to the database
    await application.save();
    job.applicants.push(applicant);
    await job.save(); // Save the updated job document with the new applicant
    // Respond with success message
    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.log(error);
    // Send error message if any issue arises
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
    const job = await JobModel.findById(application.job);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Remove the application ID from the job's applicants array
    job.applicants = job.applicants.filter(
      (applicantId) => applicantId.toString() !== id
    );
    await job.save();

    await ApplicationModel.findByIdAndDelete(id);

    res.json({ message: "Application deleted successfully!" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
// export const getApplicantsForJob = async (req, res) => {
//   const { id } = req.params; // Job ID

//   try {
//     // Find the job by ID
//     const job = await JobModel.findById(id);
//     console.log(job);
//     if (!job) {
//       return res.status(404).json({ message: "Job not found" });
//     }

//     // Ensure the applicants field is an array
//     if (!Array.isArray(job.applicants) || job.applicants.length === 0) {
//       return res.status(404).json({ message: "No applicants for this job" });
//     }

//     // Find all applications for the specific job using the job ID
//     const applications = await ApplicationModel.find({
//       applicant: { $in: job.applicants }, // Ensure the applicant is in the job's applicants list
//     });
//     console.log(applications);
//     const applicantDetails = applications.map((application) => ({
//       _id: application._id,
//       firstName: application.firstName,
//       lastName: application.lastName,
//       email: application.email,
//       contactNumber: application.contactNumber,
//       currentCity: application.currentCity,
//       coverLetter: application.coverLetter,
//       resume: `http://localhost:4000/uploads/${application.resume}`, // Assuming you have resume URL or file name
//     }));
//     // Send the response with the applicant details
//     res.status(200).json({ applicants: applicantDetails });
//   } catch (error) {
//     console.error("Error fetching applicants:", error);
//     res.status(500).json({ message: "Server error. Please try again later." });
//   }
// };
export const getApplicantsForJob = async (req, res) => {
  const { id } = req.params; // Job ID

  try {
    // Find the job by ID
    const job = await JobModel.findById(id);
    console.log(job); // For debugging, consider removing in production
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if there are any applicants for this job
    if (!job.applicants || job.applicants.length === 0) {
      return res.status(404).json({ message: "No applicants for this job" });
    }

    // Find all applications for the specific job using the job ID
    const applications = await ApplicationModel.find({
      job: job._id, // Ensure the applications are related to this specific job
      applicant: { $in: job.applicants }, // Ensure the applicant is in the job's applicants list
    });

    console.log(applications); // For debugging, consider removing in production

    // Map the application details to return
    const applicantDetails = applications.map((application) => ({
      _id: application._id,
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      contactNumber: application.contactNumber,
      currentCity: application.currentCity,
      coverLetter: application.coverLetter,
      resume: `http://localhost:4000/uploads/${application.resume}`, // Assuming you have resume URL or file name
    }));

    // Send the response with the applicant details
    res.status(200).json({ applicants: applicantDetails });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
