import React, { useState } from "react";
import { addReviewApi } from "../../api/reviewsApi";
import Rating from "@mui/material/Rating";

function AddReviews({ restaurantId, onReviewAdded }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const data = await addReviewApi({ restaurantId, rating, comment });
      setMessage("Review added successfully!");
      setComment("");
      setRating(0);

      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setMessage("Failed to add review");
    }
  };

  if (!userInfo) {
    return (
      <div className="w-full">
        <h1>Please log in to add a review</h1>
      </div>
    );
  }

  return (
    <div className="text-start flex flex-col bg-yellow-50 rounded-lg shadow-lg p-10 dark:bg-gray-800 transition-all duration-300 text-gray-900 dark:text-white w-full max-w-xl mx-auto">
      <h1 className="font-medium text-4xl dark:text-white mb-4">ADD REVIEW</h1>
      {message && <p className="mb-2 text-sm">{message}</p>}
      <form class="max-w-xl" onSubmit={handleSubmit}>
        <div>
          <Rating
            name="rating-input"
            value={rating} 
            precision={0.5}
            onChange={(event, newValue) => setRating(newValue)} 
            size="large"
          />
        </div>
        <div class="mb-5">
          <input
            type="text"
            id="large-input"
            class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddReviews;
