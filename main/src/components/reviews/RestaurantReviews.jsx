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
import { adminDeleteReviewApi } from "../../api/adminApi";

function RestaurantReviews({
  restaurantId,
  reviewsUpdated,
  onAverageCalculated,
}) {
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

  // Fixed card width in pixels
  const CARD_WIDTH_PX = 300;
  // Visible cards count based on container width will be calculated dynamically, but we can keep a max visible count
  const MAX_VISIBLE_CARDS = 3;

  const [startIndex, setStartIndex] = useState(0);

  const sliderRef = useRef(null);
  const containerRef = useRef(null);

  // Calculate how many cards can fit in container
  const [visibleCount, setVisibleCount] = useState(MAX_VISIBLE_CARDS);

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const count = Math.floor(containerWidth / CARD_WIDTH_PX);
        setVisibleCount(count > 0 ? Math.min(count, MAX_VISIBLE_CARDS) : 1);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpenModal = (reviewId) => {
    setSelectedReviewId(reviewId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      if (userInfo?.role === "admin") {
        await adminDeleteReviewApi(selectedReviewId);
      } else {
        await deleteReviewApi(selectedReviewId);
      }

      setReviews((prev) => prev.filter((r) => r._id !== selectedReviewId));
      setShowModal(false);
      setSelectedReviewId(null);

      if (startIndex > 0 && startIndex > reviews.length - visibleCount) {
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
    setStartIndex((prev) => Math.min(prev + 1, reviews.length - visibleCount));
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviewsByRestaurantId(restaurantId);
        if (data.length === 0) {
          setError("No reviews yet for this restaurant.");
        } else {
          setReviews(data);

          if (data.length > 0 && onAverageCalculated) {
            const avg =
              data.reduce((sum, r) => sum + r.rating, 0) / data.length;
            onAverageCalculated(avg);
          } else if (onAverageCalculated) {
            onAverageCalculated(0);
          }

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
  }, [restaurantId, reviewsUpdated]);

  if (loading) return <p className="p-4">Loading reviews...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  // Only show navigation buttons if we have more cards than visible
  const showNavigation = reviews.length > visibleCount;

  return (
    <div className="w-full max-w-6xl p-4 mx-auto mt-6" ref={containerRef}>
      <div className="relative overflow-hidden">
        {/* Slider container */}
        <div
          ref={sliderRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            width: `${reviews.length * CARD_WIDTH_PX}px`,
            transform: `translateX(-${startIndex * CARD_WIDTH_PX}px)`,
          }}
        >
          {reviews.map((review) => (
            <div
              key={review._id}
              className="flex-shrink-0 px-2"
              style={{ width: `${CARD_WIDTH_PX}px` }}
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
        {showNavigation && (
          <>
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
              disabled={startIndex >= reviews.length - visibleCount}
              className={`absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-gray-700 text-white rounded-full shadow-md z-10 transition-opacity ${
                startIndex >= reviews.length - visibleCount
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-gray-800"
              }`}
            >
              <FaArrowRight className="text-white" />
            </button>
          </>
        )}
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
