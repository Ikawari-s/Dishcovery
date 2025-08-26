import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  deleteReviewApi,
  getReviewsByRestaurantId,
} from "../../api/reviewsApi";
import DeleteReviewModal from "../models/DeleteReviewModal";
import StarRating from "./StarRating";

function RestaurantReviews() {
  const { id } = useParams(); // restaurantId from route
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleOpenModal = (reviewId) => {
    setSelectedReviewId(reviewId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteReviewApi(selectedReviewId);
      setReviews((prev) => prev.filter((r) => r._id !== selectedReviewId));
      setShowModal(false);
      setSelectedReviewId(null);
    } catch (err) {
      alert("Failed to delete review");
      console.error(err);
    }
  };

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
    <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto mt-6">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Reviews
        </h5>
      </div>
      <div className="flow-root">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          {reviews.map((review) => (
            <li key={review._id} className="py-3 sm:py-4">
              <div className="flex items-center">
                <div className="shrink-0">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={review.userImage || "/placeholder-avatar.jpg"}
                    alt={review.username}
                  />
                </div>
                <div className="flex-1 min-w-0 ms-4">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {review.username}
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {review.comment}
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  <StarRating rating={review.rating} />
                </div>
              </div>
              {userInfo && userInfo._id === review.userId && (
                <button
                  onClick={() => handleOpenModal(review._id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium mt-1"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <DeleteReviewModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default RestaurantReviews;
