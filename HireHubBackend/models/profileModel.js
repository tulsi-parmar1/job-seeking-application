import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  education: {
    tenth: {
      startdate: {
        type: Date,
      },
      enddate: {
        type: Date,
      },
      name: {
        type: String,
      },
    },
    twelth: {
      startdate: {
        type: Date,
      },
      enddate: {
        type: Date,
      },
      name: {
        type: String,
      },
    },
    degree: {
      startdate: {
        type: Date,
      },
      enddate: {
        type: Date,
      },
      name: {
        type: String,
      },
    },
  },
  skills: [
    {
      type: String,
    },
  ],
  profile: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  profileOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  about: {
    type: String,
  },
});
const profileModel = mongoose.model("profile", profileSchema);
export default profileModel;
