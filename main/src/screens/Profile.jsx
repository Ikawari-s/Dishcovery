import React from "react";
import SelectProfilePic from "../components/profile/SelectProfilePic";
import Followers from "../components/profile/Followers";
import Following from "../components/profile/Following";
import UserReviews from "../components/reviews/UserReviews";

function Profile() {
  const storedUser = localStorage.getItem("userInfo");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?._id; // this is the userId

  if (!user) return <p>Please log in to see your profile</p>;
  return (
    <div>
      Profile
      <SelectProfilePic />
      <Followers userId={userId} />
      <Following userId={userId} />
      <UserReviews />
    </div>
  );
}

export default Profile;
