import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = ({ isAdmin }) => {
  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminProtectedRoute;
