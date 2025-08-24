import React, { useEffect, useState } from "react";
import { getReviews } from "../../api/reviewsApi";
import { Link } from "react-router-dom";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getReviews();
      console.log("Fetched reviews:", data); // Debug
      setReviews(data);
    };
    fetchData();
  }, []);

  return (
    <div className="review-list">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review._id}
            className="review-card border p-4 mb-4 rounded shadow"
          >
            <Link to={`/review/${review._id}`}>{review._id}</Link>
            <h3 className="font-bold text-lg">{review.username.trim()}</h3>
            <p>{review.comment}</p>
            <p>Rating: {review.rating} / 5</p>
          </div>
        ))
      ) : (
        <p>No reviews found.</p>
      )}
    </div>
  );
};

export default Reviews;
