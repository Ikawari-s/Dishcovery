import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getReviewsByRestaurantId } from "../../api/reviewsApi";

function RestaurantReviews() {
  const { id } = useParams(); // restaurantId from route
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviewsByRestaurantId(id);
        if (data.length === 0) {
          setError("No reviews yet for this restaurant.");
        } else {
          setReviews(data);
        }
      } catch (err) {
        setError("Error fetching reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  if (loading) return <p className="p-4">Loading reviews...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow mt-6">
      <h3 className="text-xl font-bold mb-4">Reviews</h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <Link
                to={`/user/${review.userId}`}
                className="font-semibold text-gray-800"
              >
                {review.username}
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
      </div>
    </div>
  );
}

export default RestaurantReviews;
