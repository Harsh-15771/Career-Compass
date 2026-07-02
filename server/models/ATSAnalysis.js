import mongoose from "mongoose";

const atsAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    resumeUrl: {
      type: String, // Cloudinary secure URL
      required: true,
    },
    atsScore: {
      type: Number,
      required: true,
    },
    keywordMatch: {
      type: Number,
      default: 0,
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    analysisResult: {
      type: mongoose.Schema.Types.Mixed, // The full raw analysis JSON
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ATSAnalysis", atsAnalysisSchema);
