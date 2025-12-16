import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Moment from "moment";
import Footer from "./Footer";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { axios, token, user, authLoading, fetchBlogs } = useAppContext();

  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  // ---------- AI SUMMARY ----------
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  /* ---------------- FETCH BLOG ---------------- */
  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blogs/${id}`);
      setData(data);
    } catch {
      toast.error("Failed to load blog");
    }
  };

  /* ---------------- FETCH COMMENTS ---------------- */
  const fetchComment = async () => {
    try {
      const { data } = await axios.get(`/api/comments/${id}`);
      setComments(data);
    } catch {
      toast.error("Failed to load comments");
    }
  };

  /* ---------------- ADD COMMENT ---------------- */
  const addComment = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login to comment");
      return;
    }

    try {
      await axios.post(`/api/comments/${id}`, { content });
      toast.success("Comment added successfully");
      setContent("");
      fetchComment();
    } catch {
      toast.error("Failed to add comment");
    }
  };

  /* ---------------- DELETE BLOG ---------------- */
  const deleteBlog = async () => {
    if (!window.confirm("Delete this blog permanently?")) return;

    try {
      await axios.delete(`/api/blogs/${id}`);
      toast.success("Blog deleted");
      await fetchBlogs();
      navigate("/");
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  /* ---------------- DELETE COMMENT ---------------- */
  const deleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await axios.delete(`/api/comments/${commentId}`);
      toast.success("Comment deleted successfully");
      fetchComment();
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  /* ---------------- AI SUMMARY ---------------- */
  const generateSummary = async () => {
    if (!token) {
      toast.error("Please login to generate AI summary");
      return;
    }

    try {
      setLoadingSummary(true);

      const plainText = data.sections
        .map((s) => s.answer.replace(/<[^>]+>/g, ""))
        .join("\n\n");

      const { data: res } = await axios.post("/api/ai/summary", {
        content: plainText,
      });

      setSummary(res.summary);
    } catch {
      toast.error("Failed to generate summary");
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchComment();
  }, []);

  if (authLoading || !data) return <Loader />;

  const imageUrl =
    typeof data.profileImage === "string"
      ? data.profileImage
      : data.profileImage?.url;

  const resumeUrl = data.resume?.url;
  const resumePreviewUrl = resumeUrl
    ? resumeUrl.replace("/upload/", "/upload/w_800,pg_1,f_jpg/")
    : null;

  const isAuthor =
    token && user && data.author?._id?.toString() === user._id?.toString();

  return (
    <div className="relative">
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute -top-50 -z-1 opacity-50"
      />

      <Navbar />

      {/* -------- BLOG HEADER -------- */}
      <div className="text-center mt-20 text-gray-600">
        <p className="text-primary py-4 font-medium">
          Published on {Moment(data.createdAt).format("MMMM Do YYYY")}
        </p>

        <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
          {data.offerType} at {data.company}
        </h1>

        {/* AUTHOR NAME */}
        <div className="flex justify-center mt-6">
          <span className="inline-block py-1 px-4 rounded-full border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
            {data.author?.name}
          </span>
        </div>

        {/* AI SUMMARY BUTTON (BELOW NAME) */}
        <div className="flex justify-center mt-4">
          <button
            onClick={generateSummary}
            disabled={loadingSummary}
            className="inline-block py-1 px-4 rounded-full border text-sm border-primary/35 bg-primary/5 font-medium text-primary hover:bg-primary/10 transition cursor-pointer"
          >
            {loadingSummary ? "Generating..." : "✨ AI Summary"}
          </button>
        </div>

        {/* AUTHOR CONTROLS */}
        {isAuthor && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => navigate(`/edit-blog/${id}`)}
              className="border border-primary text-primary px-5 py-2 rounded-full hover:bg-primary/5 cursor-pointer"
            >
              Edit Blog
            </button>

            <button
              onClick={deleteBlog}
              className="border border-red-500 text-red-500 px-5 py-2 rounded-full hover:bg-red-50 cursor-pointer"
            >
              Delete Blog
            </button>
          </div>
        )}
      </div>

      {/* -------- AI SUMMARY CONTENT -------- */}
      {summary && (
        <div className="max-w-3xl mx-auto mt-10 px-5">
          <div className="border border-primary/20 bg-primary/5 rounded-xl p-5">
            <p className="font-semibold text-primary mb-2">AI Summary</p>
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* -------- BLOG BODY -------- */}
      <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
        {imageUrl && (
          <img src={imageUrl} alt="" className="rounded-3xl mb-5 mx-auto" />
        )}

        <div className="rich-text max-w-3xl mx-auto">
          {data.sections?.map((sec, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-xl font-semibold mb-2">{sec.question}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: sec.answer }}
                className="text-gray-700"
              />
            </div>
          ))}
        </div>

        {/* -------- RESUME -------- */}
        {resumePreviewUrl && (
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Resume</h2>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={resumePreviewUrl}
                alt=""
                className="w-full rounded-xl border shadow-sm hover:shadow-lg transition"
              />
            </a>
          </div>
        )}

        {/* -------- COMMENTS -------- */}
        <div className="mt-14 mb-10 max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Comments ({comments.length})</p>

          <div className="flex flex-col gap-4">
            {comments.map((item) => {
              const isCommentAuthor =
                token &&
                user &&
                item.author?._id?.toString() === user._id?.toString();

              return (
                <div
                  key={item._id}
                  className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fa-solid fa-circle-user fa-lg"></i>
                    <p className="font-medium">{item.author?.name}</p>

                    {isCommentAuthor && (
                      <button
                        onClick={() => deleteComment(item._id)}
                        className="ml-auto text-red-500 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="text-sm max-w-md ml-8">{item.content}</p>

                  <div className="absolute right-4 bottom-3 text-xs">
                    {Moment(item.createdAt).fromNow()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* -------- ADD COMMENT -------- */}
        <div className="max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Add your comment</p>

          <form
            onSubmit={addComment}
            className="flex flex-col items-start gap-4 max-w-lg"
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={!token}
              className="w-full p-2 border border-gray-300 rounded outline-none h-48"
            />

            <button className="bg-primary text-white p-2 px-8 hover:scale-102 transition-all rounded cursor-pointer">
              Submit
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
