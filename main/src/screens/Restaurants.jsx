import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRestaurants } from "../api/restaurantsApi";
import Spinner from "../components/others/Spinner";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState("All");

  const cuisines = ["All", ...new Set(restaurants.map((r) => r.cuisine))];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRestaurants =
    selectedCuisine === "All"
      ? restaurants
      : restaurants.filter((r) => r.cuisine === selectedCuisine);

  return (
    <div className="p-4 min-h-screen">
      {/* Filter Dropdown */}
      <div className="mb-6">
        <label
          htmlFor="cuisine"
          className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-300"
        >
          Filter by Cuisine:
        </label>
        <select
          id="cuisine"
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-black dark:text-white bg-white dark:bg-gray-800"
        >
          {cuisines.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
      </div>

      {/* Restaurant Cards Grid */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Link to={`/restaurant/${restaurant._id}`}>
                  <img
                    className="rounded-t-lg w-full h-48 object-cover"
                    src={restaurant.image}
                    alt={restaurant.name}
                  />
                  <div className="p-5">
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {restaurant.name}
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-300">
                      Cuisine: {restaurant.cuisine}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No restaurants found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
