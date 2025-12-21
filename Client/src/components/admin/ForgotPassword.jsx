import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post("/api/auth/forgot-password", { email });

      toast.success("OTP sent to your email");
      navigate(`/reset-password?email=${email}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 border border-primary/30 shadow-xl rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Forgot Password
        </h2>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your registered email"
          className="w-full border-b-2 p-2 mb-6 outline-none"
        />

        <button
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 cursor-pointer"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
