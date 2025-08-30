import React, { useEffect, useState } from "react";
import { getStatsApi } from "../../api/usersApi";

function UserStats({ userId }) {
  const [stats, setStats] = useState({
    reviews: 0,
    followers: 0,
    following: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getStatsApi(userId);
        setStats(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [userId]);

  if (loading) return <p>Loading stats...</p>;

  return (
    <div className="flex justify-around p-4 bg-blue-400 rounded-lg my-2 max-w-xl mx-auto">
      <div className="text-center">
        <p className="font-bold text-lg">{stats.reviews}</p>
        <p className="text-gray-500 text-sm">Reviews</p>
      </div>
      <div className="text-center">
        <p className="font-bold text-lg">{stats.followers}</p>
        <p className="text-gray-500 text-sm">Followers</p>
      </div>
      <div className="text-center">
        <p className="font-bold text-lg">{stats.following}</p>
        <p className="text-gray-500 text-sm">Following</p>
      </div>
    </div>
  );
}

export default UserStats;
