import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  deleteReviewApi,
  getReviewsByRestaurantId,
  likeReviewApi,
  unlikeReviewApi,
  updateReviewApi,
} from "../../api/reviewsApi";

import DeleteReviewModal from "../modals/DeleteReviewModal";
import ReviewCard from "../cards/ReviewCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function RestaurantReviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [startIndex, setStartIndex] = useState(0);
  const VISIBLE_COUNT = 3;

  const sliderRef = useRef(null);

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
      if (startIndex > 0 && startIndex > reviews.length - VISIBLE_COUNT) {
        setStartIndex(startIndex - 1);
      }
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
                userId: r.userId,
              }
            : r
        )
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
        updated = await unlikeReviewApi(review._id);
      } else {
        updated = await likeReviewApi(review._id);
      }

      setReviews((prev) =>
        prev.map((r) =>
          r._id === review._id ? { ...r, likes: updated.likers } : r
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + 1, reviews.length - VISIBLE_COUNT));
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviewsByRestaurantId(id);
        if (data.length === 0) {
          setError("No reviews yet for this restaurant.");
        } else {
          setReviews(data);
          setStartIndex(0);
          setError("");
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
    <div className="w-full max-w-6xl p-4 mx-auto mt-6">
      <div className="relative overflow-hidden">
        {/* Review slider container */}
        <div
          ref={sliderRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(startIndex * 60) / VISIBLE_COUNT}%)`,
            width: `${(reviews.length * 100) / VISIBLE_COUNT}%`,
          }}
        >
          {reviews.map((review) => (
            <div
              key={review._id}
              className="flex-shrink-0 px-2"
              style={{
                width: `${100 / reviews.length}%`,
              }}
            >
              <ReviewCard
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
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className={`absolute top-1/2 left-0 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-gray-700 text-white rounded-full shadow-md z-10 transition-opacity ${
            startIndex === 0
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-gray-800"
          }`}
        >
          <FaArrowLeft className="text-white" />
        </button>

        <button
          onClick={handleNext}
          disabled={startIndex >= reviews.length - VISIBLE_COUNT}
          className={`absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-gray-700 text-white rounded-full shadow-md z-10 transition-opacity ${
            startIndex >= reviews.length - VISIBLE_COUNT
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-gray-800"
          }`}
        >
          <FaArrowRight className="text-white" />
        </button>
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
