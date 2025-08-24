import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReviewById } from "../../api/reviewsApi";

const ReviewDetailed = () => {
  const { id } = useParams(); // get ID from URL
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      const data = await getReviewById(id);
      setReview(data);
      setLoading(false);
    };
    fetchReview();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!review) return <p>Review not found.</p>;

  return (
    <div className="review-detailed border p-4 rounded shadow">
      <h1>REVIEW DETAIED</h1>
      <h2 className="font-bold text-xl">{review.username}</h2>
      <p>{review.comment}</p>
      <p>Rating: {review.rating} / 5</p>
    </div>
  );
};

export default ReviewDetailed;
