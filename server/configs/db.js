import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("Database created"));
    await mongoose.connect(`${process.env.MONGODB_URI}/careercompass`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
