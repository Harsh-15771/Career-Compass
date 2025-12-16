import React, { useState } from "react";
import { assets } from "../../assets/assets";
import Navbar from "../../components/Navbar";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const navigate = useNavigate();

  const { axios, fetchBlogs } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);

  const [placementCycle, setPlacementCycle] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [offerType, setOfferType] = useState("");

  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setIsAdding(true);

      // Convert answers → sections array (backend format)
      const sections = [
        {
          question: "Brief introduction and description of your role offered",
          answer: answers.q1,
        },
        {
          question:
            "How did you get into the company? What was the selection procedure?",
          answer: answers.q2,
        },
        {
          question: "How did you prepare for this role?",
          answer: answers.q3,
        },
        {
          question:
            "What difficulties did you face and how did you overcome them?",
          answer: answers.q4,
        },
        {
          question:
            "What major points should be highlighted in a CV for this role?",
          answer: answers.q5,
        },
        {
          question: "Any specific advice for juniors targeting this role?",
          answer: answers.q6,
        },
      ];

      const formData = new FormData();

      // text fields
      formData.append("company", company);
      formData.append("role", role);
      formData.append("placementCycle", placementCycle);
      formData.append("offerType", offerType);
      formData.append("sections", JSON.stringify(sections));

      // files
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      if (!resume) {
        toast.error("Resume is required");
        setIsAdding(false);
        return;
      }
      formData.append("resume", resume);

      await axios.post("/api/blogs", formData);

      await fetchBlogs();

      toast.success("Blog submitted successfully");

      navigate("/", { replace: true });

      // reset form
      setPlacementCycle("");
      setRole("");
      setCompany("");
      setOfferType("");
      setProfileImage(null);
      setResume(null);
      setAnswers({
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: "",
        q6: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add blog");
    } finally {
      setIsAdding(false);
    }
  };

  const QUESTIONS = [
    "Brief introduction and description of your role offered",
    "How did you get into the company? What was the selection procedure?",
    "How did you prepare for this role?",
    "What difficulties did you face and how did you overcome them?",
    "What major points should be highlighted in a CV for this role?",
    "Any specific advice for juniors targeting this role?",
  ];

  return (
    <div>
      <Navbar />

      <form
        onSubmit={onSubmitHandler}
        className="flex justify-center bg-blue-50/50 text-gray-600 min-h-screen overflow-auto"
      >
        <div className="bg-white w-full max-w-4xl p-6 md:p-10 my-10 shadow rounded">
          {/* Upload Photo */}
          <p className="font-medium">Upload your photo (optional)</p>
          <label htmlFor="profileImage">
            <img
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : assets.upload_area
              }
              alt=""
              className="mt-3 h-20 rounded cursor-pointer"
            />
            <input
              type="file"
              id="profileImage"
              hidden
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </label>

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <select
              className="p-3 border rounded outline-none"
              value={placementCycle}
              onChange={(e) => setPlacementCycle(e.target.value)}
              required
            >
              <option value="">Placement Cycle</option>
              <option>CDC 2023–24</option>
              <option>CDC 2024–25</option>
            </select>

            <select
              className="p-3 border rounded outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Role</option>
              <option>Software</option>
              <option>Product</option>
              <option>Consulting</option>
              <option>Finance</option>
              <option>Core</option>
              <option>Data</option>
            </select>

            <input
              type="text"
              placeholder="Company Name"
              className="p-3 border rounded outline-none"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />

            <select
              className="p-3 border rounded outline-none"
              value={offerType}
              onChange={(e) => setOfferType(e.target.value)}
              required
            >
              <option value="">Intern / Placement</option>
              <option>Internship</option>
              <option>Placement</option>
            </select>
          </div>

          {/* Questions */}
          <div className="mt-10 space-y-6">
            {QUESTIONS.map((question, index) => (
              <div key={index}>
                <p className="font-medium mb-2">
                  Q{index + 1}. {question}
                </p>

                <textarea
                  required
                  className="w-full p-3 border rounded outline-none h-36 resize-none"
                  value={answers[`q${index + 1}`]}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      [`q${index + 1}`]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </div>

          {/* Resume */}
          <div className="mt-10">
            <p className="font-medium mb-2">Upload your resume (PDF)</p>
            <label htmlFor="resume">
              <img
                src={resume ? assets.pdf_icon : assets.upload_area}
                alt=""
                className="h-20 rounded cursor-pointer"
              />
              <input
                type="file"
                id="resume"
                hidden
                accept="application/pdf"
                onChange={(e) => setResume(e.target.files[0])}
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isAdding}
            className="mt-10 w-48 h-12 bg-primary text-white rounded text-base hover:opacity-90 transition cursor-pointer"
          >
            {isAdding ? "Submitting..." : "Add New Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
