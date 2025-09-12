import React, { useState, useEffect } from "react";
import UserReviews from "../../components/reviews/UserReviews";

import {
  fetchFollowing,
  followUserApi,
  getUserProfileApi,
  unfollowUserApi,
} from "../../api/usersApi";
import UserCard from "../../components/cards/UserCard";
import UserStats from "../../components/profile/UserStats";

function PublicProfile({ userId }) {
  const [userProfile, setUserProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Get logged-in user from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const currentUserId = userInfo?._id;

  // Fetch user profile
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

  // Check if logged-in user is following this profile
  useEffect(() => {
    const checkFollowing = async () => {
      if (!currentUserId) return;
      try {
        const following = await fetchFollowing(currentUserId);
        const followingIds = following.map((user) => user._id.toString());
        setIsFollowing(followingIds.includes(userId.toString()));
      } catch (err) {
        console.error("Error checking following:", err.message);
      }
    };
    checkFollowing();
  }, [currentUserId, userId]);

  const handleFollow = async () => {
    if (!token) {
      setMessage("You must be logged in to follow users");
      return;
    }
    try {
      setLoading(true);
      const res = await followUserApi(userId, token);
      setMessage(res.message);
      setIsFollowing(true);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!token) {
      setMessage("You must be logged in to unfollow users");
      return;
    }
    try {
      setLoading(true);
      const res = await unfollowUserApi(userId, token);
      setMessage(res.message);
      setIsFollowing(false);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-fit p-12 rounded-xl bg-white/40 dark:bg-gray-900/70 backdrop-blur-md shadow-xl mx-auto mt-4">
      <div className="flex flex-row gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-4 w-[110%]">
          <h1 className="text-4xl text-start font-bold">Profile</h1>
          <UserCard user={userProfile} />
          <UserStats userId={userId} />
          {isFollowing ? (
        <button
          type="button"
          onClick={handleUnfollow}
          disabled={loading}
          className="w-full text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 
                     hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 
                     font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          {loading ? "Processing..." : "Unfollow"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleFollow}
          disabled={loading}
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
                     hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 
                     font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          {loading ? "Processing..." : "Follow"}
        </button>
      )}

      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
        </div>

      <UserReviews userId={userId} />
      
      </div>
    </div>
  );
}

export default PublicProfile;
