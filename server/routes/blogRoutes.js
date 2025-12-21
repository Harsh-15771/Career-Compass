import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
import {
  addBlog,
  getApprovedBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  toggleApplaud,
} from "../controllers/blogController.js";
import Blog from "../models/Blog.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  addBlog
);

router.get("/", getApprovedBlogs);
router.get("/:id", getBlogById);

router.put(
  "/:id",
  authMiddleware,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateBlog
);

router.delete("/:id", authMiddleware, deleteBlog);

router.post("/:id/applaud", authMiddleware, toggleApplaud);

router.post("/:id/view", async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });

    res.json({ success: true });
  } catch (error) {
    res.status((500).json({ success: false }));
  }
});

export default router;
