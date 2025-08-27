import React from "react";
import { Navigate } from "react-router-dom"; // For redirecting
import Login from "../components/Login";
import RegisterUser from "../components/RegisterUser";

function Authentication() {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <RegisterUser />
      <Login />
    </div>
  );
}

export default Authentication;
