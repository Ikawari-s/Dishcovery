// src/components/ListCard.js
import React from "react";
import { Link } from "react-router-dom";

function ListCard({ list }) {
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  return (
    <div className="w-full max-w-sm bg-yellow-50 rounded-lg shadow-lg dark:bg-gray-800 transition-all duration-300 hover:bg-yellow-100 hover:dark:bg-gray-800 hover:-translate-y-1 p-5 px-2">
      <div className="px-5">
        <Link to={`/list/${list._id}`}>
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {list.name}
          </h5>
        </Link>

        <div className="flex flex-row items-center mt-2.5 mb-5 gap-2">
          <Link
            to={`/profile/${list.createdBy._id}`}
            className="flex items-center gap-2 text-xs font-semibold"
          >
            <img
              src={
                list.createdBy.profilePicture
                  ? `${API_URL}${list.createdBy.profilePicture}`
                  : "/images/default.jpg"
              }
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span>{list.createdBy.name}</span>
          </Link>
        </div>

        {/* Display up to 3 restaurants */}
        <div className="flex items-center gap-2 mb-2">
          {list.restaurants.slice(0, 3).map((r) =>
            r.restaurantId ? (
              <img
                key={r._id}
                src={r.restaurantId.image}
                alt={r.restaurantId.name}
                className="w-16 h-16 object-cover rounded"
              />
            ) : (
              <div
                key={r._id}
                className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded"
              >
                N/A
              </div>
            )
          )}
        </div>

        {/* Restaurant names below images */}
        <div className="flex justify-between">
          {list.restaurants.slice(0, 3).map((r) => (
            <p key={r._id} className="text-sm text-gray-600">
              {r.restaurantId ? r.restaurantId.name : "Unknown"}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListCard;
