// src/components/ListCard.js
import React from "react";
import { Link } from "react-router-dom";

function ListCard({ list }) {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="px-5 pb-5">
        <Link to={`/list/${list._id}`}>
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {list.name}
          </h5>
        </Link>

        <div className="flex items-center mt-2.5 mb-5 gap-2">
          <Link
            to={`/profile/${list.createdBy._id}`}
            className="text-xs font-semibold"
          >
            {list.createdBy.name}
          </Link>
          <Link to={`/profile/${list.createdBy._id}`}>
            <img
              src={
                list.createdBy.profilePicture
                  ? `http://localhost:5000${list.createdBy.profilePicture}`
                  : "/images/default.jpg"
              }
              alt={list.createdBy.name}
              className="w-6 h-6 rounded-full object-cover"
            />
          </Link>
        </div>

        {/* Display up to 3 restaurants */}
        <div className="flex items-center gap-2 mb-2">
          {list.restaurants.slice(0, 3).map((r) => (
            <img
              key={r._id}
              src={r.restaurantId.image}
              alt={r.restaurantId.name}
              className="w-16 h-16 object-cover rounded"
            />
          ))}
        </div>

        {/* Restaurant names below images */}
        <div className="flex justify-between">
          {list.restaurants.slice(0, 3).map((r) => (
            <p key={r._id} className="text-sm text-gray-600">
              {r.restaurantId.name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListCard;
