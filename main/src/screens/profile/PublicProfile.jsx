import React, { useState } from "react";
import UserReviews from "../../components/reviews/UserReviews";
import { followUserApi, unfollowUserApi } from "../../api/authenticationsApi";

function PublicProfile({ userId }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Get logged-in user from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  const handleFollow = async () => {
    if (!token) {
      setMessage("You must be logged in to follow users");
      return;
    }
    try {
      setLoading(true);
      const res = await followUserApi(userId, token);
      setMessage(res.message);
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
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Public Profile</h2>

      {/* Follow Button */}
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

      {/* Unfollow Button */}
      <button
        type="button"
        onClick={handleUnfollow}
        disabled={loading}
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
                   hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 
                   font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        {loading ? "Processing..." : "Unfollow"}
      </button>

      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}

      <UserReviews userId={userId} />
    </div>
  );
}

export default PublicProfile;
