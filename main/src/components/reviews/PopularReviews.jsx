import React, { useEffect, useState } from "react";
import ReviewCard from "../cards/ReviewCard";
import {
  getPopularReviewsApi,
  likeReviewApi,
  unlikeReviewApi,
  deleteReviewApi,
  updateReviewApi,
} from "../../api/reviewsApi";
import DeleteReviewModal from "../modals/DeleteReviewModal";

function PopularReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo")); // logged-in user
  const token = userInfo?.token;

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const data = await getPopularReviewsApi();
        setReviews(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  // === Like/Unlike ===
  const handleLikeToggle = async (review) => {
    try {
      if (review.likes.includes(userInfo._id)) {
        await unlikeReviewApi(review._id, token);
        setReviews((prev) =>
          prev.map((r) =>
            r._id === review._id
              ? { ...r, likes: r.likes.filter((id) => id !== userInfo._id) }
              : r
          )
        );
      } else {
        await likeReviewApi(review._id, token);
        setReviews((prev) =>
          prev.map((r) =>
            r._id === review._id
              ? { ...r, likes: [...r.likes, userInfo._id] }
              : r
          )
        );
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // === Delete ===
  const handleOpenModal = (reviewId) => {
    setSelectedReviewId(reviewId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteReviewApi(selectedReviewId, token);
      setReviews((prev) => prev.filter((r) => r._id !== selectedReviewId));
      setShowModal(false);
      setSelectedReviewId(null);
    } catch (err) {
      alert("Failed to delete review");
      console.error(err.message);
    }
  };

  // === Edit ===
  const handleEdit = (review) => {
    setEditingId(review._id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditComment("");
    setEditRating(1);
  };

  const handleUpdate = async (reviewId) => {
    try {
      await updateReviewApi(
        reviewId,
        { comment: editComment, rating: editRating },
        token
      );
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...r, comment: editComment, rating: editRating }
            : r
        )
      );
      handleCancelEdit();
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading)
    return <p className="text-center mt-6">Loading popular reviews...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold mb-4">🔥 Popular Reviews This Month</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No popular reviews yet.</p>
      ) : (
        reviews
          .slice(0, 5)
          .map((review) => (
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
              onCancelEdit={handleCancelEdit}
              onUpdate={handleUpdate}
              onDelete={() => handleOpenModal(review._id)}
              onLikeToggle={handleLikeToggle}
            />
          ))
      )}
      <DeleteReviewModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default PopularReviews;
