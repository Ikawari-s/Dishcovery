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
    <div className="w-full max-w-2xl p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto mt-6">
      <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white mb-4">
        Reviews
      </h5>

      {reviews.map((review) => (
        <article
          key={review._id}
          className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4"
        >
          <div className="flex items-center mb-2">
            <img
              className="w-10 h-10 me-4 rounded-full"
              src={review.userImage || "/placeholder-avatar.jpg"}
              alt={review.username}
            />
            <div className="font-medium dark:text-white">
              <p>{review.username}</p>
            </div>
          </div>

          <div className="mb-1">
            <StarRating rating={review.rating} />
          </div>

          <p className="mb-2 text-gray-500 dark:text-gray-400">
            {review.comment}
          </p>

          {userInfo && userInfo._id === review.userId && (
            <button
              onClick={() => handleOpenModal(review._id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          )}
        </article>
      ))}

      <DeleteReviewModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default RestaurantReviews;
