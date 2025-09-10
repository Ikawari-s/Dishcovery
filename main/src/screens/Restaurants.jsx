import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRestaurants } from "../api/restaurantsApi";
import Spinner from "../components/others/Spinner";
import RestaurantCard from "../components/cards/RestaurantCard";
import RestaurantSearch from "../components/restaurants/RestaurantSearch";
const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [showColdStartAlert, setShowColdStartAlert] = useState(false);

  const cuisines = ["All", ...new Set(restaurants.map((r) => r.cuisine))];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const timer = setTimeout(() => {
          setShowColdStartAlert(true);
        }, 3000);

        const data = await getRestaurants();
        setRestaurants(data);

        clearTimeout(timer); // clear timer if request finishes quickly
        setShowColdStartAlert(false); // hide alert if done
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
      {loading && showColdStartAlert && (
        <div
          className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
          role="alert"
        >
          <span className="font-medium">Please wait...</span> The server is
          starting due to long inactivity. This may take a few moments.
        </div>
      )}
      <div className="mb-6">
  <label
    htmlFor="cuisine"
    className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-300 text-center"
  >
    Filter by Cuisine:
  </label>

  <div className="w-full flex items-center">
    {/* Left spacer */}
    <div className="flex-1" />

    {/* Centered select */}
    <div className="flex-1 flex justify-center">
      <select
        id="cuisine"
        value={selectedCuisine}
        onChange={(e) => setSelectedCuisine(e.target.value)}
        className="p-2 rounded-md shadow-lg text-black dark:text-white bg-yellow-50 dark:bg-gray-800"
      >
        {cuisines.map((cuisine) => (
          <option key={cuisine} value={cuisine}>
            {cuisine}
          </option>
        ))}
      </select>
    </div>

    {/* Right-aligned search */}
    <div className="flex-1 flex justify-end">
      <RestaurantSearch />
    </div>
  </div>
</div>

        

      {/* Restaurant Cards Grid */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-3">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant._id}
                id={restaurant._id}
                name={restaurant.name}
                image={restaurant.image}
                cuisine={restaurant.cuisine}
              />
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No restaurants found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
