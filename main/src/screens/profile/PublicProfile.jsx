import React from "react";
import UserReviews from "../../components/reviews/UserReviews";

function PublicProfile({ userId }) {
  return (
    <div>
      PublicProfile
      <UserReviews userId={userId} />
    </div>
  );
}

export default PublicProfile;
