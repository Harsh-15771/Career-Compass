import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { blogId } = req.params;

    if (!content) {
      return res.status(400).json({
        message: "Comment content is required",
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog || !blog.isApproved) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const comment = await Comment.create({
      blog: blogId,
      author: req.user._id,
      content,
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blog: blogId })
      .populate("author", "name branch year")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Author Check
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this comment",
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
