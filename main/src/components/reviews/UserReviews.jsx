import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getReviewsByUserId } from "../../api/reviewsApi";

function UserReviews() {
  const { id } = useParams(); // Get userId from URL
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserReviews = async () => {
      setLoading(true);
      const data = await getReviewsByUserId(id);
      setReviews(data);
      setLoading(false);
    };

    fetchUserReviews();
  }, [id]);

  if (loading) return <p>Loading reviews...</p>;
  if (!reviews.length) return <p>No reviews found for this user.</p>;

  return (
    <div>
      <h2>User Reviews</h2>
      <ul>
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <Link
                to={`/restaurant/${review.restaurantId}`}
                className="font-semibold text-gray-800"
              >
                {review.restaurantName || "Restaurant"}
              </Link>
              <span className="text-yellow-500 font-medium">
                ⭐ {review.rating}/5
              </span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default UserReviews;
