import React from "react";
import { Link } from "react-router-dom";

const RestaurantCard = ({ id, name, image, cuisine }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link to={`/restaurant/${id}`}>
        <img
          className="rounded-t-lg w-full h-48 object-cover"
          src={image}
          alt={name}
        />
        <div className="p-5">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {name}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-300">
            Cuisine: {cuisine}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default RestaurantCard;
