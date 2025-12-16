import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["Software", "Product", "Consulting", "Finance", "Core", "Data"],
      required: true,
    },

    placementCycle: {
      type: String, // e.g. CDC 2023–24
      required: true,
    },

    offerType: {
      type: String,
      enum: ["Internship", "Placement"],
      required: true,
    },

    profileImage: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },

    resume: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },

    sections: {
      type: [sectionSchema],
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    applauds: {
      type: Number,
      default: 0,
    },

    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
