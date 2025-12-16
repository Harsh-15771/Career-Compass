import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
import {
  addBlog,
  getApprovedBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

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

export default router;
