import React, { useState, useRef, useEffect } from "react";
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
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the menu when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <article
      key={review._id}
      className="flex flex-col bg-yellow-50 rounded-lg shadow-lg p-4 sm:p-6 dark:bg-gray-800 transition-all duration-300 hover:bg-yellow-100 hover:dark:bg-gray-700 hover:-translate-y-1 text-gray-900 dark:text-white w-full max-w-3xl mx-auto"
      style={{ minHeight: 260 }} // Increase or tweak this height as needed
    >
      <div className="flex items-center mb-2">
        <img
          className="w-[60px] h-[60px] me-4 rounded-full object-cover"
          src={
            review.userId?.profilePicture
              ? `${API_URL}${review.userId.profilePicture}`
              : "/images/default.jpg"
          }
          alt={review.userId?.name}
        />

        {/* Name only (restaurant name moved down next to the rating) */}
        <div className="flex flex-col flex-grow">
          <div className="flex flex-row items-center justify-between gap-4">
            {review.userId?._id ? (
              <Link
                to={`/profile/${review.userId._id}`}
                className="font-medium text-2xl dark:text-white text-start"
              >
                {review.userId?.name}
              </Link>
            ) : (
              <p className="font-medium dark:text-white">
                {review.userId?.name}
              </p>
            )}

            {userInfo &&
              (userInfo._id === review.userId?._id ||
                userInfo.role === "admin") &&
              editingId !== review._id && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label="Review options"
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
                    </svg>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-10 overflow-hidden">
                      {userInfo._id === review.userId?._id && (
                        <button
                          onClick={() => {
                            onEdit(review);
                            setMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          Update/Edit
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onDelete(review._id);
                          setMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Main content area grows to fill space */}
      <div className="flex-grow text-start">
        {editingId === review._id ? (
          <>
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
              className="block w-full mb-4 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={() => onUpdate(review._id)}
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-white rounded w-full"
              >
                Save
              </button>
              <button
                onClick={onCancelEdit}
                className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-500 text-white rounded w-full"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-1 flex flex-col gap-1">
              {review.restaurantId && (
                <Link
                  to={`/restaurants/${review.restaurantId._id}`}
                  className="font-serif font-bold text-lg text-gray-800 hover:underline dark:text-gray-200 leading-none"
                >
                  {review.restaurantId.name}
                </Link>
              )}
              <Rating
                name="read-only-rating"
                value={review.rating}
                precision={0.5}
                readOnly
              />
            </div>
            <p className="mb-2 text-lg text-left">{review.comment}</p>
          </>
        )}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 text-left">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>

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
