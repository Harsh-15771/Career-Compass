import React from "react";
import { useNavigate } from "react-router-dom";
import Moment from "moment";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  const firstAnswer = blog.sections?.[0]?.answer?.replace(/<[^>]+>/g, "") || "";

  const imageUrl =
    typeof blog.profileImage === "string"
      ? blog.profileImage
      : blog.profileImage?.url;

  return (
    <div
      onClick={() => navigate(`/blog/${blog._id}`)}
      className="bg-white rounded-2xl shadow hover:shadow-2xl transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Image */}
      {imageUrl && (
        <img src={imageUrl} alt="" className="w-full h-48 object-cover" />
      )}

      {/* Content */}
      <div className="p-5">
        {/* Badges */}
        <div className="mb-3 flex gap-2">
          <span className="px-3 py-1 text-xs rounded-full bg-primary/15 text-primary">
            {blog.role}
          </span>
          <span className="px-3 py-1 text-xs rounded-full bg-primary/15 text-primary">
            {blog.offerType}
          </span>
        </div>

        {/* Company | Name */}
        <h3 className="font-semibold text-base text-gray-900 truncate">
          {blog.company} | {blog.author?.name}
        </h3>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {firstAnswer}
        </p>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between text-xs text-gray-400">
          <span>{Moment(blog.createdAt).format("MMMM D, YYYY")}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              {blog.views || 0} views
            </span>

            <span className="flex items-center gap-1">
              <i
                className={`fa-solid fa-hands-clapping transition-transform duration-200 text-black`}
              ></i>{" "}
              {blog.applauds || 0}
            </span>
          </div>
          <span className="text-primary text-lg">→</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
