import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      enum: [
        "Architecture",
        "Civil",
        "Chemical",
        "Mechanical",
        "Computer Science",
        "ECE",
        "Electrical",
        "Metallurgy",
        "Mining",
      ],
      required: true,
    },

    year: {
      type: String,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"],
      required: true,
    },

    avatar: {
      type: String, // profile image URL
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
    },

    otpExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
