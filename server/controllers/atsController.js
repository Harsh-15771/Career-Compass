import ATSAnalysis from "../models/ATSAnalysis.js";
import { cloudinary } from "../configs/cloudinary.js";
import fs from "fs";

// Helper removed to match blog structure directly

/* ================= ANALYZE RESUME ================= */
export const analyzeResume = async (req, res) => {
  try {
    const { job_description } = req.body;

    if (!req.files?.resume) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const resumeFile = req.files.resume[0];

    // 1. Upload resume to Cloudinary
    let resumeUpload;
    try {
      resumeUpload = await cloudinary.uploader.upload(resumeFile.path, {
        folder: "career-compass/resumes",
        resource_type: "auto",
      });
    } catch (uploadErr) {
      console.error("Cloudinary upload failed:", uploadErr);
      return res.status(500).json({ message: "Failed to upload resume to storage" });
    }

    // 2. Call Python FastAPI backend for analysis
    let analysisResult;
    try {
      const fileBuffer = fs.readFileSync(resumeFile.path);
      const fileBlob = new Blob([fileBuffer], { type: resumeFile.mimetype });

      const formData = new FormData();
      formData.append("resume", fileBlob, resumeFile.originalname);
      formData.append("job_description", job_description || "");

      // Call the python backend (read from env variable in production, fall back to localhost in development)
      const atsApiUrl = process.env.ATS_API_URL || "http://localhost:8000";
      const response = await fetch(`${atsApiUrl}/api/v1/analyze-resume`, {
        method: "POST",
        headers: {
          "Authorization": req.headers.authorization || "",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("FastAPI error response:", errorText);
        return res.status(response.status).json({
          message: `Analysis engine returned an error: ${errorText}`,
        });
      }

      analysisResult = await response.json();
    } catch (apiErr) {
      console.error("Failed to connect to FastAPI analysis engine:", apiErr);
      return res.status(502).json({
        message: "Failed to connect to the analysis engine. Please ensure it is running.",
      });
    } finally {
      // Clean up the temporary file created by multer
      if (fs.existsSync(resumeFile.path)) {
        fs.unlinkSync(resumeFile.path);
      }
    }

    // 3. Save analysis to MongoDB
    try {
      await ATSAnalysis.create({
        userId: req.user._id,
        filename: resumeFile.originalname,
        resume: {
          public_id: resumeUpload.public_id,
          url: resumeUpload.secure_url,
        },
        atsScore: analysisResult.ATS_score || analysisResult.ats_score || 0,
        keywordMatch: analysisResult.jd_match_analysis?.match_percentage || analysisResult.keyword_match || 0,
        missingKeywords: analysisResult.jd_match_analysis?.missing_keywords || analysisResult.missing_keywords || [],
        analysisResult: analysisResult,
      });
    } catch (dbErr) {
      console.error("Failed to save analysis history to MongoDB:", dbErr);
      // We don't fail the request if saving history fails, but log it
    }

    // 4. Return results to client
    res.status(200).json(analysisResult);
  } catch (error) {
    console.error("ATS analysis controller error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= GET ANALYSIS HISTORY ================= */
export const getHistory = async (req, res) => {
  try {
    const analyses = await ATSAnalysis.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    const results = analyses.map((doc) => ({
      id: doc._id.toString(),
      filename: doc.filename,
      resume_name: doc.filename,
      job_title: "Software Engineer",
      ats_score: doc.atsScore,
      keyword_match: doc.keywordMatch,
      missing_keywords: doc.missingKeywords,
      date: doc.createdAt.toISOString(),
      created_at: doc.createdAt.toISOString(),
      analysis_result: doc.analysisResult,
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error("Get ATS history error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= DELETE HISTORY ENTRY ================= */
export const deleteHistoryEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await ATSAnalysis.findById(id);

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found",
      });
    }

    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete matching PDF file from Cloudinary before deleting DB record
    try {
      if (analysis.resume?.public_id) {
        await cloudinary.uploader.destroy(analysis.resume.public_id);
      }
    } catch (cloudErr) {
      console.error("Cloudinary delete failed for history entry:", cloudErr.message);
    }

    await analysis.deleteOne();

    res.status(200).json({ status: "deleted", id });
  } catch (error) {
    console.error("Delete ATS history entry error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= GENERATE PDF FROM ACTIVE RESULT ================= */
export const generatePdf = async (req, res) => {
  try {
    const atsApiUrl = process.env.ATS_API_URL || "http://localhost:8000";
    const response = await fetch(`${atsApiUrl}/api/v1/generate-pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization || "",
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("FastAPI generate PDF error:", errorText);
      return res.status(response.status).json({
        message: `Failed to generate PDF: ${errorText}`,
      });
    }

    const pdfBuffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=ats_report.pdf");
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Generate PDF proxy error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= GENERATE PDF FROM HISTORY ITEM ================= */
export const generateHistoryPdf = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await ATSAnalysis.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    const atsApiUrl = process.env.ATS_API_URL || "http://localhost:8000";
    const response = await fetch(`${atsApiUrl}/api/v1/generate-pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization || "",
      },
      body: JSON.stringify(analysis.analysisResult),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("FastAPI generate history PDF error:", errorText);
      return res.status(response.status).json({
        message: `Failed to generate PDF: ${errorText}`,
      });
    }

    const pdfBuffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ats_report_${id}.pdf`
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Generate history PDF error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
