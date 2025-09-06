import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  deleteReviewApi,
  getReviewsByUserId,
  likeReviewApi,
  unlikeReviewApi,
  updateReviewApi,
} from "../../api/reviewsApi";
import StarRating from "./StarRating"; // assuming you're using the same StarRating component
import DeleteReviewModal from "../modals/DeleteReviewModal";
import ReviewCard from "../cards/ReviewCard";
import Spinner from "../others/Spinner";

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

      // ✅ Only replace likes with `updated.likers`
      setReviews((prev) =>
        prev.map((r) =>
          r._id === review._id ? { ...r, likes: updated.likers } : r
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
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

  if (loading)
    return (
      <p className="p-4">
        <Spinner />
      </p>
    );
  if (!reviews.length)
    return <p className="p-4 text-gray-500">No reviews found for this user.</p>;

  return (
    <div className="w-full max-w-2xl p-4 mx-auto mt-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        User Reviews
      </h2>

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

export default UserReviews;
