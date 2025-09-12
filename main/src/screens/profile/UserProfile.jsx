import React, { useEffect, useState } from "react";
import UserReviews from "../../components/reviews/UserReviews";
import Followers from "../../components/profile/Followers";
import Following from "../../components/profile/Following";
import UserCard from "../../components/cards/UserCard";
import { getUserProfileApi } from "../../api/usersApi";
import UserStats from "../../components/profile/UserStats";

function UserProfile({ userId }) {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfileApi(userId);
        setUserProfile(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchProfile();
  }, [userId]);
  return (
    <div className="p-16">
      <div>
        <div className="flex flex-start items-center gap-4">
          <UserCard user={userProfile} />
          <UserStats userId={userId} />
        </div>
        {/* <Followers userId={userId} />
          <Following userId={userId} /> */}
      </div>
      <div>
        <UserReviews userId={userId} />
      </div>
    </div>
  );
}

export default UserProfile;
