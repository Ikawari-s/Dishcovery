import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  deleteReviewApi,
  getReviewsByRestaurantId,
  likeReviewApi,
  unlikeReviewApi,
  updateReviewApi,
} from "../../api/reviewsApi";

import StarRating from "./StarRating";
import DeleteReviewModal from "../modals/DeleteReviewModal";

function RestaurantReviews() {
  const { id } = useParams(); // restaurantId from route
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);

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

  const handleEdit = (review) => {
    setEditingId(review._id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const handleUpdate = async (reviewId) => {
    try {
      const updated = await updateReviewApi(reviewId, {
        rating: editRating,
        comment: editComment,
      });

      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? {
                ...r,
                ...updated.review,
                userId: r.userId, // ✅ keep populated userId
              }
            : r
        )
      );
      // reset edit mode
      setEditingId(null);
      setEditComment("");
      setEditRating(0);
    } catch (err) {
      alert("Failed to update review");
      console.error(err);
    }
  };

  const handleLikeToggle = async (review) => {
    try {
      let updated;
      if (review.likes.includes(userInfo._id)) {
        // already liked → unlike
        updated = await unlikeReviewApi(review._id);
      } else {
        // not liked yet → like
        updated = await likeReviewApi(review._id);
      }

      // Update state with new likes
      setReviews((prev) =>
        prev.map((r) =>
          r._id === review._id
            ? { ...r, likes: updated.likers } // update likers array
            : r
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
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
              src={
                review.userId?.profilePicture
                  ? `http://localhost:5000${review.userId.profilePicture}`
                  : "/placeholder-avatar.jpg"
              }
              alt={review.userId?.name}
            />

            <div className="font-medium dark:text-white">
              <Link to={`/profile/${review.userId?._id}`}>
                {review.userId?.name}
              </Link>
            </div>
          </div>

          {editingId === review._id ? (
            <div>
              {/* Rating input */}
              <input
                type="number"
                min="1"
                max="5"
                value={editRating}
                onChange={(e) => setEditRating(Number(e.target.value))}
                className="w-16 border rounded p-1 mb-2 text-black"
              />
              {/* Comment input */}
              <textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="w-full border rounded p-2 mb-2 text-black"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(review._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-1">
                <StarRating rating={review.rating} />
              </div>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                {review.comment}
              </p>
            </>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
          {userInfo &&
            userInfo._id === review.userId._id &&
            editingId !== review._id && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(review._id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEdit(review)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Update/Edit
                </button>
              </div>
            )}

          <div className="flex items-center gap-2 mt-2">
            {userInfo && (
              <>
                {review.likes.includes(userInfo._id) ? (
                  // Show UNLIKE button
                  <button onClick={() => handleLikeToggle(review)}>
                    <svg
                      className="w-6 h-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                    </svg>
                  </button>
                ) : (
                  // Show LIKE button
                  <button onClick={() => handleLikeToggle(review)}>
                    <svg
                      className="w-6 h-6 text-gray-800 dark:text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                      />
                    </svg>
                  </button>
                )}
                {/* Show total likes */}
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {review.likes.length}{" "}
                  {review.likes.length === 1 ? "like" : "likes"}
                </span>
              </>
            )}
          </div>
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
