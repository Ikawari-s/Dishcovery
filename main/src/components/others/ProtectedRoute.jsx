import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const location = useLocation();

  // if not logged in → redirect to home
  if (!userInfo) {
    return <Navigate to="/" replace />;
  }

  // if logged in → render children (nested routes)
  return <Outlet />;
}

export default ProtectedRoute;
