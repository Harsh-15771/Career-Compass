import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { generateBlogSummary } from "../controllers/aiController.js";
import aiRateLimiter from "../middleware/aiRateLimiter.js";

const router = express.Router();

router.post("/summary", authMiddleware, aiRateLimiter, generateBlogSummary);

export default router;
