import userModel from "../models/usermodel.js";
import jobModel from "../models/jobModel.js";
import applicationModel from "../models/applicationModel.js";
import profileModel from "../models/profileModel.js";
export const getUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({ role: { $ne: "admin" } })
      .populate("profile", "profile.url");
    const recruiter = await userModel
      .find({ role: "recruiter" })
      .populate("profile", "profile.url");
    const jobSeeker = await userModel
      .find({ role: undefined })
      .populate("profile", "profile.url");
    if (!users) {
      return res.json({ message: "there are no user" });
    }
    res.status(201).json({
      message: "user sent succesfully",
      users: users,
      totalUsers: users.length,
      totalRecruiter: recruiter.length,
      totalJobSeeker: jobSeeker.length,
      recruiter: recruiter,
      jobSeeker,
    });
  } catch (error) {
    res.status(401).json({ error: error });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.deleteOne({ _id: id });
    res.status(201).json({ message: "user deleted successfully!!" });
    const userApplications = await applicationModel.find({ applicant: id });
    const applicationIds = userApplications.map((app) => app._id);

    await applicationModel.deleteMany({ _id: { $in: applicationIds } });
    const profileDeleted = await profileModel.deleteMany({ profileOf: id });
    const jobsDeleted = await jobModel.deleteMany({ postedBy: id });

    await jobModel.updateMany(
      { applicants: { $in: applicationIds } },
      { $pull: { applicants: { $in: applicationIds } } }
    );
  } catch (error) {
    res.status(402).json({ error: error });
    console.log(error);
  }
};
export const getJobs = async (req, res) => {
  try {
    const jobs = await jobModel.find();
    const applications = await applicationModel.find();
    if (!jobs) {
      return res.status(401).json({ message: "jobs are not available" });
    }
    res.status(201).json({
      message: "jobs sent successfully!",
      jobs,
      jobsLength: jobs.length,
      applications: applications.length,
    });
  } catch (error) {
    res.status(404).json({ error });
  }
};
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    await jobModel.deleteOne({ _id: id });
    res.status(201).json({ message: "job deleted successfully!" });
    const applicationsDeleted = await ApplicationModel.deleteMany({ job: id });
  } catch (error) {
    res.status(401).json({ error });
  }
};
export const getAdmin = async (req, res) => {
  try {
    const admin = await userModel.find({ role: "admin" });
    if (!admin) {
      return res.status(401).json({ message: "admin not found" });
    }
    res.status(201).json({ admin });
  } catch (error) {
    res.status(401).json({ error });
  }
};
export const getMonthlyRegistrations = async (req, res) => {
  try {
    const usersByMonth = await userModel.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" }, // Extracts the month from createdAt field
        },
      },
      {
        $group: {
          _id: "$month", // Group by the extracted month
          count: { $sum: 1 }, // Count the number of users for each month
        },
      },
      {
        $sort: { _id: 1 }, // Sort the results by month (1 for ascending order)
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const result = months.map((month, index) => ({
      month,
      users: usersByMonth.find((user) => user._id === index + 1)?.count || 0,
    }));

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching registration data",
      error: err.message,
    });
  }
};
