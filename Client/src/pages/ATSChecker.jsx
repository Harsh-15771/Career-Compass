import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import ATSHistory from "../components/ATSHistory";

const ATSChecker = () => {
  const navigate = useNavigate();
  const { token, axios } = useAppContext();

  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size exceeds 5MB limit.");
        setResumeFile(null);
        return;
      }
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, DOC, and DOCX files are allowed.");
        setResumeFile(null);
        return;
      }
      setResumeFile(file);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile) {
      toast.error("Please upload a resume.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_description", jobDescription);

    try {
      const response = await axios.post(
        "/api/ats/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setAnalysisResult(response.data);
      toast.success("Analysis complete!");
    } catch (err) {
      console.error("ATS Analysis error:", err);
      setError(err.response?.data?.message || err.response?.data?.detail || "Failed to analyze resume.");
      toast.error(err.response?.data?.message || err.response?.data?.detail || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ATS Resume Checker
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            {resumeFile ? (
              <p className="text-gray-700 font-medium">
                File selected: {resumeFile.name}
              </p>
            ) : (
              <>
                <img
                  src={assets.upload_area_svg}
                  alt="Upload"
                  className="mx-auto mb-4 w-24"
                />
                <p className="text-gray-500">
                  Drag & drop your resume here, or click to select (PDF, DOCX,
                  up to 5MB)
                </p>
              </>
            )}
          </div>

          <div className="mt-6">
            <label
              htmlFor="jobDescription"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Job Description (Optional)
            </label>
            <textarea
              id="jobDescription"
              rows="8"
              className="shadow-sm focus:ring-primary focus:border-primary mt-1 block w-full border border-gray-300 rounded-md p-3"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !resumeFile}
            className="mt-6 w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {loading && <Loader />}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {analysisResult && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Analysis Report
            </h2>

            {/* Overall Score */}
            <div className="text-center mb-8">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Overall ATS Score
              </p>
              <div
                className={`text-6xl font-extrabold mt-2 ${
                  analysisResult.ATS_score >= 80
                    ? "text-green-600"
                    : analysisResult.ATS_score >= 60
                      ? "text-amber-600"
                      : "text-red-600"
                }`}
              >
                {Math.round(analysisResult.ATS_score)}
                <span className="text-3xl text-gray-400">/100</span>
              </div>
              <p className="text-gray-600 italic mt-2">
                {analysisResult.interpretation ||
                  (analysisResult.ATS_score >= 80
                    ? "Great! Your resume should perform well with most ATS systems."
                    : analysisResult.ATS_score >= 60
                      ? "Good start. A few improvements will significantly boost your score."
                      : "Your resume needs work before applying. Follow the recommendations.")}
              </p>
            </div>

            {/* Component Scores */}
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Score Breakdown
            </h3>
            <div className="space-y-4 mb-8">
              {Object.entries(analysisResult.component_scores).map(
                ([key, value]) => {
                  const maxScores = {
                    formatting: 20,
                    keywords: 25,
                    content: 25,
                    skill_validation: 15,
                    ats_compatibility: 15
                  };
                  const maxScore = maxScores[key] || 100;
                  const pct = (value / maxScore) * 100;
                  return (
                    <div key={key} className="flex items-center">
                      <p className="w-1/3 text-gray-600 font-medium capitalize">
                        {key.replace(/_/g, " ")}
                      </p>
                      <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            pct >= 75
                              ? "bg-green-500"
                              : pct >= 50
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm font-semibold text-gray-700">
                        {Math.round(value)}/{maxScore}
                      </span>
                    </div>
                  );
                }
              )}
            </div>

            {/* Detailed Feedback */}
            {analysisResult.detailed_feedback &&
              analysisResult.detailed_feedback.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    Detailed Feedback
                  </h3>
                  {analysisResult.detailed_feedback.map((feedback, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg mb-3 border-l-4 border-blue-500"
                    >
                      <p className="font-semibold text-gray-800">
                        {feedback.issue_title}
                      </p>
                      <p className="text-gray-700 text-sm mt-1">
                        {feedback.explanation}
                      </p>
                      <p className="text-sm text-blue-700 mt-2">
                        <strong>Fix:</strong> {feedback.how_to_fix}
                      </p>
                    </div>
                  ))}
                </div>
              )}

            {/* JD Match Analysis */}
            {analysisResult.jd_match_analysis && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Job Description Match
                </h3>
                <p className="text-gray-700 mb-2">
                  Match Percentage:{" "}
                  <span className="font-semibold">
                    {analysisResult.jd_match_analysis.match_percentage}%
                  </span>
                </p>
                <p className="text-gray-700 mb-4">
                  Semantic Similarity:{" "}
                  <span className="font-semibold">
                    {analysisResult.jd_match_analysis.semantic_similarity}
                  </span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">
                      Matched Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.jd_match_analysis.matched_keywords.map(
                        (keyword, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full"
                          >
                            {keyword}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">
                      Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.jd_match_analysis.missing_keywords.map(
                        (keyword, index) => (
                          <span
                            key={index}
                            className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full"
                          >
                            {keyword}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skill Validation Details */}
            {analysisResult.skill_validation_details && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Skill Validation
                </h3>
                <p className="text-gray-700 mb-2">
                  Total Skills: {analysisResult.skill_validation_details.total}
                </p>
                <p className="text-gray-700 mb-2">
                  Validated Skills:{" "}
                  {analysisResult.skill_validation_details.validated_count}
                </p>
                <p className="text-gray-700 mb-4">
                  Validation Percentage:{" "}
                  {Math.round(
                    analysisResult.skill_validation_details.validation_pct,
                  )}
                  %
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">
                      Validated
                    </h4>
                    <ul className="list-disc list-inside text-gray-700">
                      {analysisResult.skill_validation_details.validated.map(
                        (item, index) => (
                          <li key={index}>
                            <span className="font-medium text-gray-800">{item.skill}</span>
                            {item.projects && item.projects.length > 0 && (
                              <span className="text-xs text-gray-500 ml-2 italic">
                                (Validated in: {item.projects.join(", ")})
                              </span>
                            )}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Unvalidated
                    </h4>
                    <ul className="list-disc list-inside text-gray-700">
                      {analysisResult.skill_validation_details.unvalidated.map(
                        (skill, index) => (
                          <li key={index}>{skill}</li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* PDF Download */}
            <div className="text-center mt-8">
              <button
                onClick={async () => {
                  try {
                    const response = await axios.post(
                      "/api/ats/generate-pdf",
                      analysisResult,
                      {
                        responseType: "blob", // Important for downloading files
                      },
                    );

                    const url = window.URL.createObjectURL(
                      new Blob([response.data]),
                    );
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "ats_report.pdf");
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                    toast.success("PDF downloaded successfully!");
                  } catch (pdfError) {
                    console.error("PDF generation error:", pdfError);
                    let errorMessage = "Failed to generate PDF.";
                    if (pdfError.response?.data instanceof Blob) {
                      try {
                        const text = await pdfError.response.data.text();
                        const errorJson = JSON.parse(text);
                        errorMessage = errorJson.message || errorJson.detail || errorMessage;
                      } catch (e) {
                        console.error(e);
                      }
                    } else if (pdfError.response?.data?.detail) {
                      errorMessage = pdfError.response.data.detail;
                    }
                    toast.error(errorMessage);
                  }
                }}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                Download Report as PDF
              </button>
            </div>
          </div>
        )}

        {/* History Section */}
        {token && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Analysis History
            </h2>
            {/* History will be loaded here */}
            <ATSHistory />
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSChecker;
