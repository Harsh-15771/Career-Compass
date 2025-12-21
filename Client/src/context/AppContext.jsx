import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");

  /* ---------------- FETCH BLOGS ---------------- */
  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blogs");
      setBlogs(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* ---------------- FETCH USER PROFILE ---------------- */
  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get("/api/user/profile");
      setUser(data);
    } catch {
      setUser(null);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    } finally {
      setAuthLoading(false);
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out successfully");
  };

  /* ---------------- INIT (REFRESH SUPPORT) ---------------- */
  useEffect(() => {
    fetchBlogs();

    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      fetchUserProfile();
    } else {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  const updateBlogInState = (updatedBlog) => {
    if (!updatedBlog?._id) return;
    setBlogs((prev) =>
      prev.map((b) => (b?._id === updatedBlog._id ? updatedBlog : b))
    );
  };

  const value = {
    axios,
    token,
    setToken,
    user,
    setUser,
    authLoading,
    logout,
    blogs,
    setBlogs,
    input,
    setInput,
    fetchBlogs,
    fetchUserProfile,
    updateBlogInState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
