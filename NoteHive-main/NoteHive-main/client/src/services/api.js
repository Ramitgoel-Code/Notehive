import axios from 'axios';

// Set up the base URL for the API (make sure to change this if you deploy to production)
const API_URL = 'http://localhost:5000/api/auth/';

// Register user
// /src/services/api.js
export const registerUser = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/register', {  // Replace with your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to register user');
      }
  
      return await response.json();  // Assuming your API returns a JSON response
    } catch (error) {
      throw new Error(error.message);
    }
  };
  

// Login user
export const loginUser = async (userData) => {
    try {
        // Send a POST request to the login route
        const response = await axios.post(`${API_URL}login`, userData);
        return response.data;
    } catch (error) {
        // Handle errors (return the error message from the backend)
        throw error.response.data;
    }
};
