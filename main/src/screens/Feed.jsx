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

function Feed() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(1);

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

  // === Delete Review ===
  const handleDelete = async (reviewId) => {
    try {
      await deleteReviewApi(reviewId, token);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
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
    <div className="max-w-2xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Your Feed</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet from people you follow.</p>
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
              onDelete={handleDelete}
              onLikeToggle={handleLikeToggle}
            />
          ))
      )}
      <PopularReviews />
    </div>
  );
}

export default Feed;
