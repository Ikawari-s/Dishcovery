import { useEffect, useState } from "react";
import { getRatingStatsByRestaurantId } from "../../api/reviewsApi";

function RatingStats({ restaurantId }) {
  const [stats, setStats] = useState({
    avgRating: 0,
    totalReviews: 0,
    distribution: [],
  });

  useEffect(() => {
    async function fetchStats() {
      const data = await getRatingStatsByRestaurantId(restaurantId);
      setStats(data);
    }
    fetchStats();
  }, [restaurantId]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      {/* Average Rating */}
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 me-1 ${
              i < Math.round(stats.avgRating)
                ? "text-yellow-300"
                : "text-gray-300"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523...Z" />
          </svg>
        ))}
        <p className="ms-1 text-sm font-medium text-gray-500">
          {stats.avgRating}
        </p>
        <p className="ms-1 text-sm font-medium text-gray-500">out of</p>
        <p className="ms-1 text-sm font-medium text-gray-500">5</p>
      </div>

      <p className="text-sm font-medium text-gray-500">
        {stats.totalReviews} global ratings
      </p>

      {/* Distribution */}
      {stats.distribution.map((d) => (
        <div className="flex items-center mt-4" key={d.star}>
          <span className="text-sm font-medium text-blue-600">
            {d.star} star
          </span>
          <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded-sm">
            <div
              className="h-5 bg-yellow-300 rounded-sm"
              style={{ width: `${d.percentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-500">
            {d.percentage}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default RatingStats;
