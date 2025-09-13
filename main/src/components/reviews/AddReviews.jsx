import React, { useState } from "react";
import { addReviewApi } from "../../api/reviewsApi";
import Rating from "@mui/material/Rating";

function AddReviews({ restaurantId, onReviewAdded, onClose }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await addReviewApi({ restaurantId, rating, comment });
      setMessage("Review added successfully!");
      setComment("");
      setRating(0);
      if (onReviewAdded) onReviewAdded();
      if (onClose) onClose(); // close modal after submission
    } catch (err) {
      setMessage("Failed to add review");
    }
  };

  if (!userInfo) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-100">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
          <h1 className="text-center">Please log in to add a review</h1>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-500 text-white py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-100">
      <div className="bg-yellow-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg p-8 w-full max-w-xl relative">
        <button
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 text-xl hover:text-red-500"
          onClick={onClose}
        >
          &times;
        </button>

        <h1 className="text-3xl font-semibold mb-4">Add Review</h1>
        {message && <p className="mb-4 text-sm">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Rating
              name="rating-input"
              value={rating}
              precision={0.5}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
            />
          </div>
          <div className="mb-5">
            <input
              type="text"
              className="block w-full p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddReviews;
