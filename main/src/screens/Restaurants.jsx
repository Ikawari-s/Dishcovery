import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRestaurants } from "../api/restaurantsApi"; // ✅ Make sure the path is correct

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRestaurants();
      console.log("Fetched restaurants:", data);
      setRestaurants(data);
    };
    fetchData();
  }, []);

  return (
    <div className="review-list p-4">
      <h2 className="text-2xl font-bold mb-4">Restaurants</h2>

      {restaurants.length > 0 ? (
        restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="border p-4 mb-4 rounded shadow bg-white"
          >
            <Link
              to={`/restaurant/${restaurant._id}`}
              className="text-xl font-semibold text-blue-600 hover:underline"
            >
              {restaurant.name}
            </Link>

            <p className="text-sm text-gray-600">
              Cuisine: <span className="font-medium">{restaurant.cuisine}</span>
            </p>

            <p className="text-sm">
              Address:{" "}
              {`${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.zipcode}`}
            </p>

            <p>Rating: ⭐ {restaurant.rating} / 5</p>

            <p className="text-sm">
              Status:{" "}
              <span
                className={`font-semibold ${
                  restaurant.is_open ? "text-green-600" : "text-red-600"
                }`}
              >
                {restaurant.is_open ? "Open" : "Closed"}
              </span>
            </p>

            <div className="mt-2">
              {restaurant.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-200 text-sm text-gray-700 px-2 py-1 rounded mr-2"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <img
              class="h-auto max-w-lg"
              src={restaurant.image}
              alt="image description"
            />
          </div>
        ))
      ) : (
        <p>No restaurants found.</p>
      )}
    </div>
  );
};

export default Restaurants;
