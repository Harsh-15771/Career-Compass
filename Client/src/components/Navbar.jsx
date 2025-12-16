import React, { useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, logout } = useAppContext();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center py-4 sm:py-5 mx-4 sm:mx-20 xl:mx-32">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="w-32 sm:w-48 lg:w-60 xl:w-72 cursor-pointer"
      />

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Add New Blog */}
        <button
          onClick={() => {
            if (!token) {
              toast.error("Please login to continue");
              navigate("/login", { state: { from: "/addblog" } });
            } else {
              navigate("/addblog");
            }
          }}
          className="px-5 py-3 text-lg font-medium rounded-full border border-gray
    text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Add New Blog
        </button>

        {/* Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="p-3 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {token ? (
              <i className="fa-solid fa-circle-user fa-2xl"></i>
            ) : (
              <i className="fa-solid fa-bars text-xl"></i>
            )}
          </button>

          {open && (
            <div
              className="absolute right-0 top-full mt-2
                w-40 bg-white border border-primary/20
                rounded-lg shadow-lg overflow-hidden z-50"
            >
              {!token ? (
                <>
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-3 text-base hover:bg-gray-100 cursor-pointer"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/signup");
                    }}
                    className="w-full text-left px-4 py-3 text-base hover:bg-gray-100 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full text-left px-4 py-3 text-base hover:bg-gray-100 cursor-pointer"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-3 text-base text-red-500 hover:bg-red-50 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
