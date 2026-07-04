import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const OtpRegistration = ({ setUsername, setEmail }) => {
  const navigate = useNavigate();
  
  // Main state
  const [registrationData, setRegistrationData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: ""
  });
  
  const [uiState, setUiState] = useState({
    isLoading: false,
    message: "",
    messageType: "", // "success", "error", "info"
    step: 1, // 1: initial form, 2: OTP verification
    passwordVisible: false
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({ ...prev, [name]: value }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setUiState(prev => ({
      ...prev,
      passwordVisible: !prev.passwordVisible
    }));
  };

  // Basic validation before submission
  const validateForm = () => {
    // Check if passwords match
    if (registrationData.password !== registrationData.confirmPassword) {
      setUiState(prev => ({
        ...prev,
        message: "Passwords do not match!",
        messageType: "error"
      }));
      return false;
    }

    // Check for password complexity
    if (registrationData.password.length < 8) {
      setUiState(prev => ({
        ...prev,
        message: "Password must be at least 8 characters long",
        messageType: "error"
      }));
      return false;
    }

    // Check for valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registrationData.email)) {
      setUiState(prev => ({
        ...prev,
        message: "Please enter a valid email address",
        messageType: "error"
      }));
      return false;
    }

    return true;
  };

  // Handle sending OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setUiState(prev => ({
      ...prev,
      isLoading: true,
      message: "Sending OTP to your email...",
      messageType: "info"
    }));

    try {
      const response = await axios.post("http://localhost:5000/api/auth/send-otp", {
        username: registrationData.username,
        email: registrationData.email,
        password: registrationData.password
      });
      
      setUiState(prev => ({
        ...prev,
        message: response.data.message || "OTP sent successfully!",
        messageType: "success",
        step: 2
      }));
      
      // Store temporary data
      localStorage.setItem("otpUser", JSON.stringify({
        username: registrationData.username,
        email: registrationData.email,
        password: registrationData.password
      }));
    } catch (error) {
      setUiState(prev => ({
        ...prev,
        message: error.response?.data?.message || "Error sending OTP. Please try again.",
        messageType: "error"
      }));
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    setUiState(prev => ({
      ...prev,
      isLoading: true,
      message: "Verifying OTP...",
      messageType: "info"
    }));

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: registrationData.email,
        otp: registrationData.otp
      });

      if (response.data.success) {
        // Store user data
        localStorage.setItem("username", registrationData.username);
        localStorage.setItem("email", registrationData.email);
        
        // Update global state if available
        if (setUsername) setUsername(registrationData.username);
        if (setEmail) setEmail(registrationData.email);

        setUiState(prev => ({
          ...prev,
          message: "OTP verified successfully! Redirecting...",
          messageType: "success"
        }));

        // Redirect after a brief delay
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      } else {
        setUiState(prev => ({
          ...prev,
          message: response.data.message || "Invalid OTP. Please try again.",
          messageType: "error"
        }));
      }
    } catch (error) {
      setUiState(prev => ({
        ...prev,
        message: error.response?.data?.message || "Error verifying OTP.",
        messageType: "error"
      }));
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    setUiState(prev => ({
      ...prev,
      isLoading: true,
      message: "Resending OTP...",
      messageType: "info"
    }));

    try {
      const response = await axios.post("http://localhost:5000/api/auth/send-otp", {
        username: registrationData.username,
        email: registrationData.email,
        password: registrationData.password
      });

      setUiState(prev => ({
        ...prev,
        message: response.data.message || "OTP resent successfully!",
        messageType: "success"
      }));
    } catch (error) {
      setUiState(prev => ({
        ...prev,
        message: error.response?.data?.message || "Error resending OTP.",
        messageType: "error"
      }));
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Close the registration form
  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Close button */}
        <div className="relative">
          <button 
            className="absolute top-4 right-4 text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors"
            onClick={handleClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600 text-center">Secure registration with OTP verification</p>
        </div>
        
        {/* Registration form - Step 1 */}
        {uiState.step === 1 && (
          <div className="px-8 pb-8">
            <form onSubmit={handleSendOTP}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="username">
                  Username
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="text"
                  id="username"
                  name="username"
                  value={registrationData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="email"
                  id="email"
                  name="email"
                  value={registrationData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    type={uiState.passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    value={registrationData.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                    onClick={togglePasswordVisibility}
                  >
                    {uiState.passwordVisible ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
                        <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type={uiState.passwordVisible ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={registrationData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
              
              <button
                type="submit"
                className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${
                  uiState.isLoading 
                    ? "bg-blue-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={uiState.isLoading}
              >
                {uiState.isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </div>
                ) : "Send OTP"}
              </button>
            </form>
          </div>
        )}
        
        {/* OTP verification - Step 2 */}
        {uiState.step === 2 && (
          <div className="px-8 pb-8">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                We've sent a verification code to <span className="font-medium">{registrationData.email}</span>
              </p>
            </div>
            
            <form onSubmit={handleVerifyOTP}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="otp">
                  Enter Verification Code
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="text"
                  id="otp"
                  name="otp"
                  value={registrationData.otp}
                  onChange={handleChange}
                  placeholder="● ● ● ● ● ●"
                  maxLength="6"
                  required
                />
              </div>
              
              <button
                type="submit"
                className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${
                  uiState.isLoading 
                    ? "bg-blue-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={uiState.isLoading}
              >
                {uiState.isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </div>
                ) : "Verify & Create Account"}
              </button>
              
              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => setUiState(prev => ({ ...prev, step: 1, message: "" }))}
                >
                  Back to Form
                </button>
                
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={handleResendOTP}
                  disabled={uiState.isLoading}
                >
                  Resend Code
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Message display */}
        {uiState.message && (
          <div className={`mx-8 mb-6 p-3 rounded-lg ${
            uiState.messageType === "success" ? "bg-green-50 text-green-800" :
            uiState.messageType === "error" ? "bg-red-50 text-red-800" :
            "bg-blue-50 text-blue-800"
          }`}>
            <p className="text-sm">{uiState.message}</p>
          </div>
        )}
        
        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-8 py-4">
          <p className="text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpRegistration;
