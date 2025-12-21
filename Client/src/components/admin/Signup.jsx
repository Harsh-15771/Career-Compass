import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsAdding(true);

      const payload = {
        name,
        email,
        password,
        branch,
        year,
      };

      await axios.post("/api/auth/signup", payload);

      toast.success("OTP sent to your email");

      // REDIRECT TO OTP PAGE
      navigate(`/verify-otp?email=${email}`);

      // reset form
      setName("");
      setEmail("");
      setPassword("");
      setBranch("");
      setYear("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to sign up");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full py-6 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Sign Up</span>
            </h1>
            <p className="font-light">Create your account</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 w-full sm:max-w-md text-gray-600"
          >
            {/* Name */}
            <div className="flex flex-col">
              <label>Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                required
                placeholder="Enter your full name"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label>Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                required
                placeholder="Enter your Email ID"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label>Password</label>

              <div className="relative mb-6">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create a password"
                  className="border-b-2 border-gray-300 p-2 pr-10 outline-none w-full"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i
                    className={`fa-solid ${
                      showPassword ? "fa-eye" : "fa-eye-slash"
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            {/* Branch */}
            <div className="flex flex-col">
              <label>Branch</label>
              <select
                onChange={(e) => setBranch(e.target.value)}
                value={branch}
                required
                className="border-b-2 border-gray-300 p-2 outline-none mb-6 bg-transparent cursor-pointer"
              >
                <option value="">Select Branch</option>
                <option value="Architecture">Architecture</option>
                <option value="Civil">Civil</option>
                <option value="Chemical">Chemical</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Computer Science">Computer Science</option>
                <option value="ECE">ECE</option>
                <option value="Electrical">Electrical</option>
                <option value="Metallurgy">Metallurgy</option>
                <option value="Mining">Mining</option>
              </select>
            </div>

            {/* Year */}
            <div className="flex flex-col">
              <label>Year</label>
              <select
                onChange={(e) => setYear(e.target.value)}
                value={year}
                required
                className="border-b-2 border-gray-300 p-2 outline-none mb-8 bg-transparent cursor-pointer"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isAdding}
              className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all cursor-pointer"
            >
              {isAdding ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-semibold cursor-pointer">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
