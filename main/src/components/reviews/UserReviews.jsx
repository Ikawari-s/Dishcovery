import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getReviewsByUserId } from "../../api/reviewsApi";
import StarRating from "./StarRating"; // assuming you're using the same StarRating component

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

  if (loading) return <p className="p-4">Loading reviews...</p>;
  if (!reviews.length)
    return <p className="p-4 text-gray-500">No reviews found for this user.</p>;

  return (
    <div className="w-full max-w-2xl p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto mt-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        User Reviews
      </h2>

      {reviews.map((review) => (
        <article
          key={review._id}
          className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4"
        >
          <div className="flex items-center mb-2">
            <img
              className="w-10 h-10 me-4 rounded-full"
              src="/placeholder-avatar.jpg"
              alt="User avatar"
            />
            <div class="font-medium dark:text-white">
              <p>{review.username}</p>
            </div>
            <div className="font-medium dark:text-white">
              <Link
                to={`/restaurant/${review.restaurantId}`}
                className="hover:underline text-blue-600 dark:text-blue-400"
              >
                {review.restaurantName || "Restaurant"}
              </Link>
            </div>
          </div>

          <div className="mb-1">
            <StarRating rating={review.rating} />
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-2">
            {review.comment}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </article>
      ))}
    </div>
  );
}

export default UserReviews;
