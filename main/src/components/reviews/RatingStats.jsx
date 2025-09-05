import { useEffect, useState } from "react";
import { getRatingStatsByRestaurantId } from "../../api/reviewsApi";
import Rating from "@mui/material/Rating";

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
    <div>
      <div className="flex flex-col mb-2">
        <div className="flex justify-center mb-1">
  <Rating
    name="average-rating"
    value={Number(stats.avgRating) || 0}
    precision={0.1}
    readOnly
    size="small"
  />
</div>
        <p className="ml-2 text-sm font-medium text-gray-500">
            {(Number(stats.avgRating) || 0).toFixed(2)} out of 5
          </p>
        <p className="text-sm font-medium text-gray-500">
          All Reviews: {stats.totalReviews || 0}
        </p>
      </div>

      {/* <p className="text-sm font-medium text-gray-500">
        {stats.totalReviews} global ratings
      </p>

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
      ))} */}
    </div>
  );
}

export default RatingStats;
