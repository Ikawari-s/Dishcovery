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
    <div>
      UserProfile
      <UserCard user={userProfile} />
      <UserStats userId={userId} />
      <Followers userId={userId} />
      <Following userId={userId} />
      <UserReviews userId={userId} />
    </div>
  );
}

export default UserProfile;
