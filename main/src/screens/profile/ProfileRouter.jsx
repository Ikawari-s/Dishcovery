import React from "react";
import { useParams } from "react-router-dom";
import UserProfile from "./UserProfile";
import PublicProfile from "./PublicProfile";

function ProfileRouter() {
  const { id } = useParams(); // The id from the URL
  const storedUser = localStorage.getItem("userInfo");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // If user is logged in and visiting their own profile
  if (user && user._id === id) {
    return <UserProfile userId={id} />; // Pass userId to UserProfile
  } else {
    return <PublicProfile userId={id} />; // Pass userId to PublicProfile
  }
}

export default ProfileRouter;
