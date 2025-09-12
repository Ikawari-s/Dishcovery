import React, { useEffect, useState } from "react";
import UserReviews from "../../components/reviews/UserReviews";
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
    <div className="w-fit p-12 rounded-xl bg-white/40 dark:bg-gray-900/70 backdrop-blur-md shadow-xl mx-auto mt-4">
      <div className="flex flex-row gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl text-start font-bold">Profile</h1>
          <UserCard user={userProfile} />
          <UserStats userId={userId} />
        </div>

        {/* Right Column */}
        <div className="w-[40%]">
          <UserReviews userId={userId} />
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
