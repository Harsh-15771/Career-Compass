import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.delete("/profile", authMiddleware, deleteProfile);

export default router;
