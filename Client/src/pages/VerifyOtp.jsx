import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { axios, setToken, fetchUserProfile } = useAppContext();

  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // resend cooldown
  const [cooldown, setCooldown] = useState(60);

  /* ---------- COUNTDOWN TIMER ---------- */
  useEffect(() => {
    if (cooldown === 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  /* ---------- VERIFY OTP ---------- */
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post("/api/auth/verify-otp", {
        email,
        otp,
      });

      // Store token
      localStorage.setItem("token", data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setToken(data.token);

      // IMPORTANT FIX: fetch real user profile
      await fetchUserProfile();

      toast.success("Email verified successfully 🎉");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RESEND OTP ---------- */
  const resendOtp = async () => {
    try {
      await axios.post("/api/auth/resend-otp", { email });
      toast.success("OTP resent to your email");
      setCooldown(60);
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  if (!email) {
    return (
      <p className="text-center mt-20 text-red-500">
        Invalid verification link
      </p>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-6 border border-primary/30 shadow-xl rounded-lg">
        <form
          onSubmit={handleVerify}
          className="bg-white p-8 rounded-xl w-full max-w-sm"
        >
          <h2 className="text-2xl font-semibold text-center mb-2">
            Verify Email
          </h2>

          <p className="text-sm text-gray-600 text-center mb-6">
            OTP sent to <b>{email}</b>
          </p>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="w-full border px-4 py-2 rounded mb-4 outline-none text-center tracking-widest"
          />

          <button
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded hover:opacity-90 transition cursor-pointer"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center mt-4 text-sm">
            {cooldown > 0 ? (
              <p className="text-gray-500">Resend OTP in {cooldown}s</p>
            ) : (
              <button
                type="button"
                onClick={resendOtp}
                className="text-primary hover:underline cursor-pointer"
              >
                Resend OTP
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
