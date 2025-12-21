import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import { cloudinary } from "../configs/cloudinary.js";

// GET USER PROFILE
export const getProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE USER PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name, branch, year } = req.body;

    // Update only allowed fields
    if (name) req.user.name = name;
    if (branch) req.user.branch = branch;
    if (year) req.user.year = year;

    await req.user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE USER PROFILE
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // FIND ALL BLOGS BY USER
    const blogs = await Blog.find({ author: userId });

    // DELETE CLOUDINARY FILES FOR EACH BLOG
    for (const blog of blogs) {
      try {
        if (blog.profileImage?.public_id) {
          await cloudinary.uploader.destroy(blog.profileImage.public_id);
        }
      } catch (err) {
        console.error("Profile image delete failed:", err.message);
      }

      try {
        if (blog.resume?.public_id) {
          await cloudinary.uploader.destroy(blog.resume.public_id);
        }
      } catch (err) {
        console.error("Resume delete failed:", err.message);
      }
    }

    // DELETE COMMENTS ON USER BLOGS
    const blogIds = blogs.map((b) => b._id);
    await Comment.deleteMany({ blog: { $in: blogIds } });

    // DELETE BLOGS
    await Blog.deleteMany({ author: userId });

    // DELETE USER COMMENTS (OTHER BLOGS)
    await Comment.deleteMany({ author: userId });

    // DELETE USER
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User and all related data deleted successfully",
    });
  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET PUBLIC USER PROFILE
export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name branch year createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const blogs = await Blog.find({
      author: user._id,
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      user,
      blogs,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
