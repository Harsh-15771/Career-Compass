import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import atsRoutes from "./routes/atsRoutes.js";
import { connectCloudinary } from "./configs/cloudinary.js";
import { startCleanupJob } from "./utils/cleanup.js";

const app = express();
await connectDB();
connectCloudinary();
startCleanupJob();

// Middlewares
app.use(cors());
app.use(express.json());

//Routes

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ats", atsRoutes);
app.get("/", (req, res) => res.send("API is working"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

export default app;
