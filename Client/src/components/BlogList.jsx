import React, { useState, useEffect } from "react";
import { blogCategories } from "../assets/assets";
import { motion } from "motion/react";
import BlogCard from "./BlogCard";
import { useAppContext } from "../context/AppContext";
import { useSearchParams } from "react-router-dom";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const { blogs, input } = useAppContext();

  // ✅ READ QUERY PARAMS
  const [searchParams] = useSearchParams();
  const offerTypeFromUrl = searchParams.get("offerType");

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredBlogs = () => {
    if (!blogs || blogs.length === 0) return [];

    let result = blogs;

    // 🔹 SEARCH FILTER
    if (input.trim()) {
      const search = input.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.company?.toLowerCase().includes(search) ||
          blog.offerType?.toLowerCase().includes(search) ||
          blog.author?.name?.toLowerCase().includes(search) ||
          blog.role?.toLowerCase().includes(search)
      );
    }

    // 🔹 OFFER TYPE FILTER (FROM URL)
    if (offerTypeFromUrl) {
      result = result.filter((blog) => blog.offerType === offerTypeFromUrl);
    }

    return result;
  };

  // 🔹 ROLE FILTER (MENU)
  const results = filteredBlogs().filter((blog) =>
    menu === "All" ? true : blog.role === menu
  );

  return (
    <div>
      {/* CATEGORY MENU */}
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {blogCategories.map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => setMenu(item)}
              className={`cursor-pointer text-gray-500 ${
                menu === item && "text-white px-4 pt-0.5"
              }`}
            >
              {item}
              {menu === item && (
                <motion.div
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute left-0 right-0 top-0 h-7 z-[-1] bg-primary rounded-full"
                />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* BLOG GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-24 mx-8 sm:mx-16 xl:mx-32">
        {results.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 mt-10">
            No results found
          </p>
        ) : (
          results.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        )}
      </div>
    </div>
  );
};

export default BlogList;
