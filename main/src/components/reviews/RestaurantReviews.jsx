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
import ReviewCard from "./ReviewCard";

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
        <ReviewCard
          key={review._id}
          review={review}
          userInfo={userInfo}
          editingId={editingId}
          editComment={editComment}
          editRating={editRating}
          setEditComment={setEditComment}
          setEditRating={setEditRating}
          onEdit={handleEdit}
          onUpdate={handleUpdate}
          onCancelEdit={() => setEditingId(null)}
          onDelete={handleOpenModal}
          onLikeToggle={handleLikeToggle}
        />
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
