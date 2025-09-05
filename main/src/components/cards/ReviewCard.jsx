import React from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";

function ReviewCard({
  review,
  userInfo,
  editingId,
  editComment,
  editRating,
  onEdit,
  onUpdate,
  onCancelEdit,
  onDelete,
  onLikeToggle,
  setEditComment,
  setEditRating,
}) {
  return (
    <article
      key={review._id}
      className="mb-6 bg-yellow-50 rounded-lg shadow-lg sm:p-6 dark:bg-gray-900 pb-4 transition-all duration-300 hover:bg-yellow-100 hover:dark:bg-gray-800 hover:-translate-y-1 text-gray-900 dark:text-white max-w-xs min-h-[300px] mx-auto"
    >
      <div className="flex items-center mb-2">
        <img
          className="w-[60px] h-[60px] me-4 rounded-full object-cover"
          src={
            review.userId?.profilePicture
              ? `http://localhost:5000${review.userId.profilePicture}`
              : "/images/default.jpg"
          }
          alt={review.userId?.name}
        />

        {review.userId?._id ? (
          <div className="font-medium text-2xl dark:text-white">
            <Link to={`/profile/${review.userId._id}`}>
              {review.userId?.name}
            </Link>
          </div>
        ) : (
          <div className="font-medium dark:text-white">
            <p>{review.userId?.name}</p>
          </div>
        )}

        {review.restaurant && (
          <div className="ml-3 font-medium dark:text-white">
            <Link
              to={`/restaurant/${review.restaurantId}`}
              className="hover:underline text-blue-600 dark:text-blue-400"
            >
              {review.restaurant}
            </Link>
          </div>
        )}
      </div>

      {editingId === review._id ? (
        <div>
          <Rating
            name="edit-rating"
            value={editRating}
            precision={0.5}
            onChange={(event, newValue) => setEditRating(newValue ?? 0)}
            size="large"
          />
          <textarea
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            className="w-full border rounded p-2 mb-2 text-black"
          />
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate(review._id)}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="px-3 py-1 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-1">
            <Rating
              name="read-only-rating"
              value={review.rating}
              precision={0.5}
              readOnly
              size="small"
            />
          </div>
          <p className="mb-2 text-lg text-left">{review.comment}</p>
        </>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400 text-left">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>

      {userInfo &&
        (userInfo._id === review.userId?._id ||
          userInfo._id === review.userId) &&
        editingId !== review._id && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onDelete(review._id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
            <button
              onClick={() => onEdit(review)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Update/Edit
            </button>
          </div>
        )}

      <div className="flex items-center gap-2 mt-2">
        {userInfo && (
          <>
            {review.likes.includes(userInfo._id) ? (
              <button onClick={() => onLikeToggle(review)}>
                <svg
                  className="w-6 h-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                </svg>
              </button>
            ) : (
              <button onClick={() => onLikeToggle(review)}>
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                  />
                </svg>
              </button>
            )}
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {review.likes.length}{" "}
              {review.likes.length === 1 ? "like" : "likes"}
            </span>
          </>
        )}
      </div>
    </article>
  );
}

export default ReviewCard;
