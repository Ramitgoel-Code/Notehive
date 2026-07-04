// src/pages/VerifyOTP.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("otpUser"));

    if (!userData || !userData.email) {
      return setMessage("User data not found. Please try registering again.");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: userData.email,
        otp,
      });
      setMessage(res.data.message);
      localStorage.removeItem("otpUser");
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to verify OTP");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
      <form onSubmit={handleVerify} className="w-full max-w-sm space-y-4 bg-white p-6 rounded shadow">
        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Verify & Register
        </button>
        <p className="text-center text-sm text-red-600">{message}</p>
      </form>
    </div>
  );
}

export default VerifyOTP;
