import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ username }) => {
  return username ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
