import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addComment,
  getCommentsByBlog,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

// Add comment (auth required)
router.post("/:blogId", authMiddleware, addComment);

// Get comments (public)
router.get("/:blogId", getCommentsByBlog);

// Delete comments
router.delete("/:id", authMiddleware, deleteComment);

export default router;
