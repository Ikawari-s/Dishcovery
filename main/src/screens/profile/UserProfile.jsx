import React from "react";
import UserReviews from "../../components/reviews/UserReviews";
import Followers from "../../components/profile/Followers";
import Following from "../../components/profile/Following";
import SelectProfilePic from "../../components/profile/SelectProfilePic";

function UserProfile({ userId }) {
  return (
    <div>
      UserProfile
      <SelectProfilePic />
      <Followers userId={userId} />
      <Following userId={userId} />
      <UserReviews userId={userId} />
    </div>
  );
}

export default UserProfile;
