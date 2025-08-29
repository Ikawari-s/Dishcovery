import React from "react";
import UserReviews from "../../components/reviews/UserReviews";
import Followers from "../../components/profile/Followers";
import Following from "../../components/profile/Following";

function UserProfile({ userId }) {
  return (
    <div>
      UserProfile
      <Followers userId={userId} />
      <Following userId={userId} />
      <UserReviews userId={userId} />
    </div>
  );
}

export default UserProfile;
