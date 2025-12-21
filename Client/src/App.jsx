import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Login from "./components/admin/Login";
import Signup from "./components/admin/Signup";
import AddBlog from "./pages/admin/AddBlog";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import "quill/dist/quill.snow.css";
import Profile from "./pages/admin/Profile";
import EditBlog from "./pages/admin/EditBlog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQs from "./pages/FAQs";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./components/admin/ForgotPassword";
import ResetPassword from "./components/admin/ResetPassword";

const App = () => {
  const { token, authLoading } = useAppContext();

  if (authLoading) {
    return null;
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/addblog"
          element={
            token ? (
              <AddBlog />
            ) : (
              <Navigate to="/login" state={{ from: "/addblog" }} />
            )
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/edit-blog/:id" element={<EditBlog />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
};

export default App;
