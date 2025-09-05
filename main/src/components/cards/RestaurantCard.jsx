import React from "react";
import { Link } from "react-router-dom";

const RestaurantCard = ({ id, name, image, cuisine }) => {
  return (
    <div className="shadow-xl bg-yellow-50 dark:bg-gray-800 rounded-lg p-2 transition-all duration-300 hover:bg-yellow-100 hover:dark:bg-gray-00 hover:-translate-y-1 min-h-80">
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
