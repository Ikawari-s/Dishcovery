import React, { useState } from "react";
import { Navigate } from "react-router-dom"; // For redirecting
import Login from "../components/Login";
import RegisterUser from "../components/RegisterUser";

function Authentication() {
  const userInfo = localStorage.getItem("userInfo");
  const [showRegister, setShowRegister] = useState(false);

  if (userInfo) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      {showRegister ? (
        <RegisterUser setShowRegister={setShowRegister} />
      ) : (
        <Login setShowRegister={setShowRegister} />
      )}
    </div>
  );
}

export default Authentication;
