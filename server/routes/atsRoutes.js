import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
import {
  analyzeResume,
  getHistory,
  deleteHistoryEntry,
  generatePdf,
  generateHistoryPdf,
} from "../controllers/atsController.js";

const router = express.Router();

router.post(
  "/analyze",
  authMiddleware,
  upload.fields([{ name: "resume", maxCount: 1 }]),
  analyzeResume
);

router.get("/history", authMiddleware, getHistory);
router.delete("/history/:id", authMiddleware, deleteHistoryEntry);
router.post("/generate-pdf", authMiddleware, generatePdf);
router.get("/history/:id/pdf", authMiddleware, generateHistoryPdf);

export default router;
