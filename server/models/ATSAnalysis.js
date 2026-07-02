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
    resume: {
      public_id: {
        type: String,
        // making this optional so old records don't fail validation on save
      },
      url: {
        type: String, // Cloudinary secure URL
      },
    },
    // Restored for backwards compatibility with older records
    resumeUrl: {
      type: String,
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
