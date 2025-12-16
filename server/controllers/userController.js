import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

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

    // Find all blogs by user
    const blogs = await Blog.find({ author: userId }).select("_id");

    const blogIds = blogs.map((blog) => blog._id);

    // Delete all comments on user's blogs
    await Comment.deleteMany({ blog: { $in: blogIds } });

    // Delete all blogs by user
    await Blog.deleteMany({ author: userId });

    // Delete all comments written by user (on other blogs)
    await Comment.deleteMany({ author: userId });

    // Finally delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User and all related data deleted successfully",
    });
  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
