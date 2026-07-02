import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import Loader from "./Loader";

const ATSHistory = () => {
  const { token, axios } = useAppContext();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/api/ats/history");
        setHistory(response.data);
      } catch (err) {
        console.error("Failed to fetch ATS history:", err);
        setError("Failed to load history.");
        toast.error("Failed to load history.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchHistory();
    } else {
      setHistory([]);
      setLoading(false);
    }
  }, [token, axios]);

  const handleDownloadPdf = async (analysisId) => {
    try {
      const response = await axios.get(
        `/api/ats/history/${analysisId}/pdf`,
        {
          responseType: "blob", // Important for downloading files
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ats_report_${analysisId}.pdf`);
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
  };

  const handleDeleteAnalysis = async (analysisId) => {
    if (!window.confirm("Are you sure you want to delete this analysis?")) {
      return;
    }

    try {
      await axios.delete(`/api/ats/history/${analysisId}`);
      setHistory(history.filter((item) => item.id !== analysisId));
      toast.success("Analysis deleted successfully!");
    } catch (deleteError) {
      console.error("Failed to delete analysis:", deleteError);
      toast.error("Failed to delete analysis.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (history.length === 0) {
    return <p className="text-gray-600">No previous analyses found.</p>;
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div key={item.id} className="bg-gray-100 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {item.filename || "Untitled Resume"}
              </p>
              <p className="text-sm text-gray-600">
                Score: {Math.round(item.ats_score)}/100
              </p>
              <p className="text-xs text-gray-500">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  setExpandedId(expandedId === item.id ? null : item.id)
                }
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                {expandedId === item.id ? "Hide Details" : "Show Details"}
              </button>
              <button
                onClick={() => handleDownloadPdf(item.id)}
                className="text-green-600 hover:text-green-800 font-medium cursor-pointer"
              >
                Download PDF
              </button>
              <button
                onClick={() => handleDeleteAnalysis(item.id)}
                className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>

          {expandedId === item.id && item.analysis_result && (
            <div className="mt-4 p-4 bg-white rounded-md border border-gray-200 text-sm">
              <h4 className="font-semibold text-gray-700 mb-2">
                Detailed Analysis Summary:
              </h4>
              
              {/* Component Scores Breakdown */}
              {item.analysis_result.component_scores && (
                <div className="mb-4 grid grid-cols-2 gap-2 text-gray-600 border-b pb-3 border-gray-100">
                  <div><strong>Formatting:</strong> {Math.round(item.analysis_result.component_scores.formatting)}/20</div>
                  <div><strong>Keywords & Skills:</strong> {Math.round(item.analysis_result.component_scores.keywords)}/25</div>
                  <div><strong>Content Quality:</strong> {Math.round(item.analysis_result.component_scores.content)}/25</div>
                  <div><strong>Skill Validation:</strong> {Math.round(item.analysis_result.component_scores.skill_validation)}/15</div>
                  <div className="col-span-2"><strong>ATS Compatibility:</strong> {Math.round(item.analysis_result.component_scores.ats_compatibility)}/15</div>
                </div>
              )}

              {/* JD Match details */}
              {item.analysis_result.jd_match_analysis && item.analysis_result.jd_match_analysis.match_percentage > 0 ? (
                <div className="space-y-1.5 text-gray-600">
                  <p>
                    <strong>Match Percentage:</strong>{" "}
                    <span className="font-medium text-primary">
                      {item.analysis_result.jd_match_analysis.match_percentage}%
                    </span>
                  </p>
                  <p>
                    <strong>Keywords Matched:</strong>{" "}
                    <span className="font-medium">
                      {(item.analysis_result.jd_match_analysis.matched_keywords || []).join(", ") || "None"}
                    </span>
                  </p>
                  <p>
                    <strong>Missing Keywords:</strong>{" "}
                    <span className="font-medium text-red-600">
                      {(item.analysis_result.jd_match_analysis.missing_keywords || []).join(", ") || "None"}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 italic text-xs">
                  No Job Description was provided for this analysis.
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ATSHistory;
