import React, { useState } from "react";
import { addReviewApi } from "../../api/reviewsApi";
import ReactStars from "react-stars"; // Import the react-stars package

function AddReviews({ restaurantId }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
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
    <div className="w-full">
      <h1>ADD REVIEW</h1>
      {message && <p className="mb-2 text-sm">{message}</p>}
      <form class="max-w-xl mx-auto" onSubmit={handleSubmit}>
        <div class="mb-5">
          <label
            for="large-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Comment
          </label>
          <input
            type="text"
            id="large-input"
            class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div>
          <label
            for="small-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Rating
          </label>
          <ReactStars
            count={5} // This limits the number of stars to 5
            value={rating}
            onChange={(newRating) => setRating(newRating)}
            size={24}
            half={true} // Enable half-star selection
            color1="#f0f0f0"
            color2="#ffc107"
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
