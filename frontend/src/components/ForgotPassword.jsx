import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Send email instead of phone
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      toast.success(res.data.message);

      setTimeout(() => {
        // ✅ Pass email to verify page
        navigate("/verify-otp", { state: { email } });
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-5">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md font-[Segoe_UI]">
        <h2 className="text-center mb-6 text-2xl font-semibold text-gray-800">
          📧 Forgot Password
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 mb-5 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg text-lg transition duration-200"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
