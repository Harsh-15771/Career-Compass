import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import { cloudinary } from "../configs/cloudinary.js";
import main from "../configs/gemini.js";

/* ================= ADD BLOG ================= */
export const addBlog = async (req, res) => {
  try {
    const { company, role, placementCycle, offerType, sections } = req.body;

    if (!company || !role || !placementCycle || !offerType || !sections) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files?.resume) {
      return res.status(400).json({ message: "Resume is required" });
    }

    // ---------- PROFILE IMAGE (OPTIONAL) ----------
    let profileImage = null;
    if (req.files?.profileImage) {
      const imageUpload = await cloudinary.uploader.upload(
        req.files.profileImage[0].path,
        { folder: "career-compass/profile-images" }
      );

      profileImage = {
        url: imageUpload.secure_url,
        public_id: imageUpload.public_id,
      };
    }

    // ---------- RESUME (REQUIRED) ----------
    const resumeUpload = await cloudinary.uploader.upload(
      req.files.resume[0].path,
      {
        folder: "career-compass/resumes",
        resource_type: "auto",
      }
    );

    const resume = {
      url: resumeUpload.secure_url,
      public_id: resumeUpload.public_id,
    };

    // ---------- PARSE SECTIONS ----------
    let parsedSections;
    try {
      parsedSections = JSON.parse(sections);
    } catch {
      return res.status(400).json({ message: "Invalid sections format" });
    }

    // ---------- CREATE BLOG ----------
    const blog = await Blog.create({
      author: req.user._id,
      company,
      role,
      placementCycle,
      offerType,
      profileImage,
      resume,
      sections: parsedSections,
      isApproved: true,
    });

    res.status(201).json({
      message: "Blog submitted successfully",
      blogId: blog._id,
    });
  } catch (error) {
    console.error("Add blog error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= GET ALL BLOGS ================= */
export const getApprovedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isApproved: true })
      .populate("author", "name branch year")
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= GET BLOG BY ID ================= */
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "name branch year"
    );

    if (!blog || !blog.isApproved) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= UPDATE BLOG ================= */
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { company, role, placementCycle, offerType, sections } = req.body;

    if (company) blog.company = company;
    if (role) blog.role = role;
    if (placementCycle) blog.placementCycle = placementCycle;
    if (offerType) blog.offerType = offerType;

    if (sections) {
      try {
        blog.sections = JSON.parse(sections);
      } catch {
        return res.status(400).json({ message: "Invalid sections format" });
      }
    }

    // ---------- UPDATE PROFILE IMAGE ----------
    if (req.files?.profileImage) {
      if (blog.profileImage?.public_id) {
        await cloudinary.uploader.destroy(blog.profileImage.public_id);
      }

      const imageUpload = await cloudinary.uploader.upload(
        req.files.profileImage[0].path,
        { folder: "career-compass/profile-images" }
      );

      blog.profileImage = {
        url: imageUpload.secure_url,
        public_id: imageUpload.public_id,
      };
    }

    // ---------- UPDATE RESUME ----------
    if (req.files?.resume) {
      if (blog.resume?.public_id) {
        await cloudinary.uploader.destroy(blog.resume.public_id);
      }

      const resumeUpload = await cloudinary.uploader.upload(
        req.files.resume[0].path,
        {
          folder: "career-compass/resumes",
          resource_type: "auto",
        }
      );

      blog.resume = {
        url: resumeUpload.secure_url,
        public_id: resumeUpload.public_id,
      };
    }

    await blog.save();

    res.status(200).json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= DELETE BLOG ================= */
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ---------- DELETE CLOUDINARY FILES ----------
    if (blog.profileImage?.public_id) {
      await cloudinary.uploader.destroy(blog.profileImage.public_id);
    }

    if (blog.resume?.public_id) {
      await cloudinary.uploader.destroy(blog.resume.public_id);
    }

    // ---------- DELETE COMMENTS ----------
    await Comment.deleteMany({ blog: blog._id });

    // ---------- DELETE BLOG ----------
    await blog.deleteOne();

    res.status(200).json({
      message: "Blog and related data deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//------------APPLAUDS---------------
export const toggleApplaud = async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const userId = req.user._id.toString();
  const index = blog.applaudedBy.indexOf(userId);

  let hasApplauded = false;

  if (index === -1) {
    blog.applaudedBy.push(userId);
    blog.applauds += 1;
    hasApplauded = true;
  } else {
    blog.applaudedBy.splice(index, 1);
    blog.applauds -= 1;
  }

  await blog.save();

  res.json({
    applauds: blog.applauds,
    hasApplauded,
    blog,
  });
};
