import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      toast.success("Password reset successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return <p className="text-center mt-20 text-red-500">Invalid reset link</p>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 border border-primary/30 shadow-xl rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Reset Password
        </h2>

        {/* OTP */}
        <input
          type="text"
          placeholder="Enter OTP"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border-b-2 p-2 mb-6 outline-none text-center tracking-widest"
        />

        {/* PASSWORD WITH EYE ICON */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b-2 p-2 pr-10 outline-none"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition cursor-pointer"
          >
            <i
              className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
            ></i>
          </button>
        </div>

        <button
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition cursor-pointer"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
