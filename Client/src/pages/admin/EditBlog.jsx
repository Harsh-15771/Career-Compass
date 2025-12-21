import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import Navbar from "../../components/Navbar";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { axios, user } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);

  const [placementCycle, setPlacementCycle] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [offerType, setOfferType] = useState("");

  const [existingProfileImage, setExistingProfileImage] = useState("");
  const [existingResume, setExistingResume] = useState("");

  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
  });

  /* ---------- Resume preview (Cloudinary PDF → image) ---------- */
  const resumePreviewUrl = existingResume
    ? existingResume.replace("/upload/", "/upload/w_800,pg_1,f_jpg/")
    : null;

  /* ---------------- FETCH BLOG ---------------- */
  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`/api/blogs/${id}`);

      if (data.author?._id !== user?._id) {
        toast.error("You are not allowed to edit this blog");
        navigate("/");
        return;
      }

      setCompany(data.company);
      setRole(data.role);
      setPlacementCycle(data.placementCycle);
      setOfferType(data.offerType);
      setExistingProfileImage(data.profileImage?.url || "");
      setExistingResume(data.resume?.url || "");

      setAnswers({
        q1: data.sections?.[0]?.answer || "",
        q2: data.sections?.[1]?.answer || "",
        q3: data.sections?.[2]?.answer || "",
        q4: data.sections?.[3]?.answer || "",
        q5: data.sections?.[4]?.answer || "",
        q6: data.sections?.[5]?.answer || "",
      });
    } catch {
      toast.error("Failed to load blog");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  /* ---------------- SUBMIT ---------------- */
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);

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
      formData.append("company", company);
      formData.append("role", role);
      formData.append("placementCycle", placementCycle);
      formData.append("offerType", offerType);
      formData.append("sections", JSON.stringify(sections));

      if (profileImage) formData.append("profileImage", profileImage);
      if (resume) formData.append("resume", resume);

      await axios.put(`/api/blogs/${id}`, formData);

      toast.success("Blog updated successfully");
      navigate(`/blog/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div>
      <Navbar />

      <form
        onSubmit={onSubmitHandler}
        className="flex justify-center bg-blue-50/50 text-gray-600 min-h-screen overflow-auto"
      >
        <div className="bg-white w-full max-w-4xl p-6 md:p-10 my-10 shadow rounded">
          {/* -------- PROFILE IMAGE -------- */}
          <p className="font-medium">Update your photo (optional)</p>

          <label htmlFor="profileImage">
            <img
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : existingProfileImage || assets.upload_area
              }
              alt=""
              className="mt-3 h-20 rounded cursor-pointer object-cover"
            />
            <input
              type="file"
              id="profileImage"
              hidden
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </label>

          {/* -------- METADATA -------- */}
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

          {/* -------- QUESTIONS -------- */}
          <div className="mt-10 space-y-6">
            {Object.values(answers).map((_, index) => (
              <div key={index}>
                <p className="font-medium mb-2">Q{index + 1}</p>
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

          {/* -------- RESUME (PREVIEW LIKE Blog.jsx) -------- */}
          <div className="mt-10">
            <p className="font-medium mb-2">Replace resume (optional)</p>

            <label htmlFor="resume">
              <img
                src={
                  resume
                    ? assets.pdf_icon
                    : resumePreviewUrl || assets.upload_area
                }
                alt="Resume Preview"
                className="h-32 rounded cursor-pointer border hover:shadow transition"
              />
              <input
                type="file"
                id="resume"
                hidden
                accept="application/pdf"
                onChange={(e) => setResume(e.target.files[0])}
              />
            </label>

            {existingResume && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Click preview to view full PDF
              </p>
            )}
          </div>

          {/* -------- SUBMIT -------- */}
          <button
            type="submit"
            disabled={isSaving}
            className="mt-10 w-48 h-12 bg-primary text-white rounded text-base hover:opacity-90 transition cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
