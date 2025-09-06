// src/components/others/AdminRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo || userInfo.role !== "admin") {
    // Redirect non-admins to home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
