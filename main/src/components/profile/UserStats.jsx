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
    <div className="flex justify-around p-5 gap-10 bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-70 ">
      <div className="text-center">
        <p className="font-bold text-lg">{stats.reviews}</p>
        <p className="text-gray-100 text-sm">Reviews</p>
      </div>
      <div className="text-center">
        <p className="font-bold text-lg">{stats.followers}</p>
        <p className="text-gray-100 text-sm">Followers</p>
      </div>
      <div className="text-center">
        <p className="font-bold text-lg">{stats.following}</p>
        <p className="text-gray-100 text-sm">Following</p>
      </div>
    </div>
  );
}

export default UserStats;
