import ATSAnalysis from "../models/ATSAnalysis.js";
import { cloudinary } from "../configs/cloudinary.js";

// Helper to extract Cloudinary public_id from secure URL
const getPublicIdFromUrl = (url) => {
  try {
    const match = url.match(/\/career-compass\/resumes\/[a-zA-Z0-9_-]+/);
    if (match) {
      return match[0].replace(/^\//, "");
    }
  } catch (e) {
    return null;
  }
  return null;
};

export const startCleanupJob = () => {
  const runCleanup = async () => {
    try {
      console.log("[CLEANUP] Checking for resume analyses older than 30 days...");
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

      // Find all records older than 30 days
      const oldAnalyses = await ATSAnalysis.find({ createdAt: { $lt: oneMonthAgo } });

      if (oldAnalyses.length === 0) {
        console.log("[CLEANUP] No old resumes to clean up.");
        return;
      }

      console.log(`[CLEANUP] Found ${oldAnalyses.length} old analyses to remove. Starting deletion...`);

      for (const analysis of oldAnalyses) {
        const publicId = getPublicIdFromUrl(analysis.resumeUrl);
        
        if (publicId) {
          try {
            // resource_type: "image" is used because Cloudinary uploads PDFs as images
            await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
            console.log(`[CLEANUP] Successfully deleted file from Cloudinary: ${publicId}`);
          } catch (cloudErr) {
            console.error(`[CLEANUP] Failed to delete from Cloudinary: ${publicId}`, cloudErr);
          }
        }

        // Delete MongoDB record
        await ATSAnalysis.findByIdAndDelete(analysis._id);
        console.log(`[CLEANUP] Deleted database record for: ${analysis.filename}`);
      }

      console.log("[CLEANUP] Old resumes cleanup finished.");
    } catch (err) {
      console.error("[CLEANUP] Error during scheduled cleanup execution:", err);
    }
  };

  // Run immediately on server start, then execute once every 24 hours
  runCleanup();
  setInterval(runCleanup, 24 * 60 * 60 * 1000);
};
