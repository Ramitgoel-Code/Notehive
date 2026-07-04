// src/pages/SendOTP.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SendOTP() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", form);
      setMessage(res.data.message);
      localStorage.setItem("otpUser", JSON.stringify(form));
      navigate("/verify-otp");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h2 className="text-2xl font-bold mb-4">Register with OTP</h2>
      <form onSubmit={handleSendOTP} className="w-full max-w-sm space-y-4 bg-white p-6 rounded shadow">
        <input name="username" onChange={handleChange} placeholder="Username" className="w-full p-2 border rounded" required />
        <input name="email" type="email" onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Send OTP
        </button>
        <p className="text-center text-sm text-green-600">{message}</p>
      </form>
    </div>
  );
}

export default SendOTP;
