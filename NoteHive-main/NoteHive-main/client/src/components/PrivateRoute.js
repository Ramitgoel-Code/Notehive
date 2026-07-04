import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if token exists in localStorage

  // If token doesn't exist, redirect to login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If token exists, render the child components (dashboard, etc.)
  return children;
};

export default PrivateRoute;
