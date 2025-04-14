import profileModel from "../models/profileModel.js";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/usermodel.js";

export const postInfo = async (req, res) => {
  const {
    degree,
    tenth,
    twelth,
    sdegree,
    stenth,
    stwelth,
    edegree,
    etenth,
    etwelth,
    skills,
    about,
  } = req.body;

  const education = {
    tenth: { startdate: stenth, enddate: etenth, name: tenth },
    twelth: { startdate: stwelth, enddate: etwelth, name: twelth },
    degree: { startdate: sdegree, enddate: edegree, name: degree },
  };
  try {
    // Find existing profile or create a new one
    const profile = await profileModel.findOneAndUpdate(
      { profileOf: req.user._id },
      {
        education,
        skills,
        about,
      },
      { new: true, upsert: true } // Upsert: Create if not found
    );

    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.profile = profile._id;
    await user.save();

    res.send({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error in postInfo:", error);
    res
      .status(500)
      .send({ error: "An error occurred while updating the profile" });
  }
};
export const profileChange = async (req, res) => {
  try {
    const { profile } = req.files;

    if (!profile) {
      return res.status(400).send({ error: "No profile image uploaded" });
    }

    // Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      profile.tempFilePath,
      { folder: "HireHub" } //cloudinary folder name
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      return res.status(500).json({ message: "Cloudinary upload error" });
    }

    const user = req.user;

    // Find existing profile or create a new one
    let existingProfile = await profileModel.findOne({ profileOf: user._id });

    if (!existingProfile) {
      // Create a new profile if it does not exist
      existingProfile = await profileModel.create({
        profile: {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        },
        profileOf: user._id,
      });
    } else {
      // Update existing profile with new picture
      existingProfile.profile = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
      await existingProfile.save();
    }

    // Update user profile reference
    user.profile = existingProfile._id;
    await user.save();

    // Respond with the updated profile URL
    res.send({
      profile: existingProfile.profile.url,
      message: "Profile picture updated successfully!",
      user,
    });
  } catch (error) {
    console.error("Error in profileChange:", error);
    res
      .status(500)
      .send({ error: "An error occurred while updating the profile picture" });
  }
};
export const getInfo = async (req, res) => {
  const user = req.user;
  console.log(user);
  try {
    const userProfile = await profileModel.findById(user.profile);
    res.send({
      profile: userProfile,
    });
  } catch (error) {
    res.send(error);
  }
};

export const getProfile = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const profile = await profileModel.findById(user?.profile);

    if (!profile) {
      return res.status(200).json({ url: null }); // Return null if no profile found
    }

    res.send({
      url: profile.profile?.url || null,
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
