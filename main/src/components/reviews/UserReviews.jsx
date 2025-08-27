import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  deleteReviewApi,
  getReviewsByUserId,
  updateReviewApi,
} from "../../api/reviewsApi";
import StarRating from "./StarRating"; // assuming you're using the same StarRating component
import DeleteReviewModal from "../modals/DeleteReviewModal";

function UserReviews() {
  const { id } = useParams(); // Get userId from URL
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
        prev.map((r) => (r._id === reviewId ? updated.review : r))
      );

      setEditingId(null);
      setEditComment("");
      setEditRating(0);
    } catch (err) {
      alert("Failed to update review");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchUserReviews = async () => {
      setLoading(true);
      try {
        const data = await getReviewsByUserId(id);
        if (!data.length) {
          setError("No reviews found for this user.");
        } else {
          setReviews(data);
        }
      } catch (err) {
        setError("Error fetching reviews.");
      } finally {
        setLoading(false);
      }
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
              src={review.userImage || "/placeholder-avatar.jpg"}
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
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {review.comment}
              </p>
            </>
          )}

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
          {userInfo &&
            userInfo._id === review.userId &&
            editingId !== review._id && (
              <div className="flex gap-2 mt-2">
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

export default UserReviews;
