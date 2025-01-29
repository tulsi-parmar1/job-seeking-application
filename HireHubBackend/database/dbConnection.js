import mongoose from "mongoose";
export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbname: process.env.dbname,
    })
    .then(() => {
      console.log("connected");
    })
    .catch((err) => {
      console.log(`error ocuured while connectiong ${err}`);
    });
};
