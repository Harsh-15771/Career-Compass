import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { axios, setToken, fetchUserProfile } = useAppContext();

  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handelSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/auth/login", {
        email,
        password,
      });

      //  Set token
      setToken(data.token);
      localStorage.setItem("token", data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      // Fetch user profile (CRITICAL)
      await fetchUserProfile();

      toast.success("Logged in successfully");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 border border-primary/30 shadow-xl rounded-lg">
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-primary">Login</h1>
          <p className="font-light">Enter your credentials to Login</p>
        </div>

        <form onSubmit={handelSubmit} className="text-gray-600">
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="w-full border-b-2 p-2 mb-6 outline-none"
            placeholder="Enter your Email"
          />

          <label>Password</label>
          <div className="relative mb-6">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              required
              className="w-full border-b-2 p-2 pr-10 outline-none"
              placeholder="Enter your Password"
            />
            <p
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-right text-primary cursor-pointer hover:underline mb-4 pt-2"
            >
              Forgot Password?
            </p>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/3 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <i
                className={`fa-solid ${
                  showPassword ? "fa-eye" : "fa-eye-slash"
                }`}
              ></i>
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded hover:bg-primary/90 cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>

      <p className="mt-4 text-sm">
        New to Career Compass?{" "}
        <Link to="/signup" className="text-primary font-semibold">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
