import React, { useEffect, useState } from "react";
import ReviewCard from "../components/cards/ReviewCard";
import { getFeedReviewsApi } from "../api/usersApi";
import {
  deleteReviewApi,
  likeReviewApi,
  unlikeReviewApi,
  updateReviewApi,
} from "../api/reviewsApi";
import PopularReviews from "../components/reviews/PopularReviews";
import Spinner from "../components/others/Spinner";
import { adminDeleteReviewApi } from "../api/adminApi";
import DeleteReviewModal from "../components/modals/DeleteReviewModal";
import NearMe from "../components/location/NearMe";

function Feed() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  // ✅ Get logged-in user + token from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo")); // { _id, name, token, ... }
  const token = userInfo?.token;

  // === Fetch Feed ===
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await getFeedReviewsApi(token);
        setReviews(data);
      } catch (err) {
        console.error("Error fetching feed:", err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchFeed();
  }, [token]);

  // === Like / Unlike ===
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
      console.error("Error toggling like:", err.message);
    }
  };

  // === Open Delete Modal ===
  const handleOpenModal = (reviewId) => {
    setSelectedReviewId(reviewId);
    setShowModal(true);
  };

  // === Confirm Delete ===
  const handleDelete = async () => {
    try {
      if (userInfo?.role === "admin") {
        await adminDeleteReviewApi(selectedReviewId); // ✅ admin delete
      } else {
        await deleteReviewApi(selectedReviewId, token); // ✅ user delete
      }

      setReviews((prev) => prev.filter((r) => r._id !== selectedReviewId));
      setShowModal(false);
      setSelectedReviewId(null);
    } catch (err) {
      alert("Failed to delete review");
      console.error("Error deleting review:", err.message);
    }
  };

  // === Edit Review ===
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
      console.error("Error updating review:", err.message);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-6">
        <Spinner />
      </p>
    );

return (
  <div className="mx-auto mt-6 px-4">
    <h1 className="text-4xl font-bold mb-4">Your Feed</h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* === Review Cards in 4-column grid === */}
      {reviews.length === 0 ? (
        <p className="text-gray-500 col-span-full">
          No reviews yet from people you follow.
        </p>
      ) : (
        reviews
          .slice(0, 10)
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
              onDelete={handleOpenModal}
              onLikeToggle={handleLikeToggle}
              className="bg-gray-500"
            />
          ))
      )}

      {/* === Popular Reviews (full width) === */}
      <div className="col-span-full">
        <PopularReviews />
      </div>

      {/* === Near Me (full width) === */}
      <div className="col-span-full">
        <NearMe />
      </div>
    </div>

    {/* === Delete Modal === */}
    <DeleteReviewModal
      show={showModal}
      handleClose={() => setShowModal(false)}
      handleDelete={handleDelete}
    />
  </div>
);
}

export default Feed;
