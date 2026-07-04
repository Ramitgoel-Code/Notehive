import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Login.css';

const Login = ({ setUsername, setAdminUsername, role = 'user' }) => {
  const navigate = useNavigate();
  
  // Form data state
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  
  // UI state
  const [uiState, setUiState] = useState({
    isLoading: false,
    message: '',
    messageType: '', // 'success', 'error', 'info'
    passwordVisible: false,
    showForm: true
  });

  // Determine API endpoint & redirect path based on role
  const apiEndpoint = role === 'admin' ? 'http://localhost:5000/admin/login' : 'http://localhost:5000/api/auth/login';
  const redirectPath = role === 'admin' ? '/admin' : '/dashboard';

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setUiState(prev => ({
      ...prev,
      passwordVisible: !prev.passwordVisible
    }));
  };

  // Handle form close
  const handleClose = () => {
    navigate('/');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setUiState(prev => ({
      ...prev,
      isLoading: true,
      message: 'Authenticating...',
      messageType: 'info'
    }));

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (response.ok) {
        const storageKey = role === 'admin' ? 'adminToken' : 'token';
        const usernameKey = role === 'admin' ? 'adminUsername' : 'username';

        localStorage.setItem(storageKey, data.token);
        localStorage.setItem(usernameKey, data.username);
        localStorage.setItem('role', data.role);

        if (role === 'admin') {
          setAdminUsername(data.username);
        } else {
          setUsername(data.username);
        }

        setUiState(prev => ({
          ...prev,
          message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful! Redirecting...`,
          messageType: 'success'
        }));

        setTimeout(() => {
          navigate(redirectPath);
        }, 1500);
      } else {
        setUiState(prev => ({
          ...prev,
          message: data.message || 'Invalid credentials. Please try again.',
          messageType: 'error'
        }));
      }
    } catch (error) {
      setUiState(prev => ({
        ...prev,
        message: 'Server error. Please try again later.',
        messageType: 'error'
      }));
    } finally {
      setUiState(prev => ({ 
        ...prev, 
        isLoading: false 
      }));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      {uiState.showForm && (
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
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              {role === 'admin' ? 'Admin Login' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              {role === 'admin' ? 'Access your admin dashboard' : 'Log in to access your account'}
            </p>
          </div>
          
          {/* Login form */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    type={uiState.passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
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
                <div className="flex justify-end mt-1">
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </Link>
                </div>
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
                    Logging in...
                  </div>
                ) : "Log In"}
              </button>
            </form>
          </div>
          
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
              {role === 'user' ? (
                <>
                  Don't have an account?{" "}
                  <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  Not an admin?{" "}
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    User Login
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;