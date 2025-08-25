import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantsById } from "../api/restaurantsApi";

function RestaurantDetailed() {
  const { id } = useParams(); // Get restaurant ID from route
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await getRestaurantsById(id);
        if (data) {
          setRestaurant(data);
        } else {
          setError("Restaurant not found.");
        }
      } catch (err) {
        setError("Error fetching restaurant.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!restaurant) return null;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
      <p className="text-gray-700 mb-1">
        <span className="font-semibold">Cuisine:</span> {restaurant.cuisine}
      </p>
      <p className="text-gray-700 mb-1">
        <span className="font-semibold">Rating:</span> {restaurant.rating} / 5
      </p>
      <p className="text-gray-700 mb-1">
        <span className="font-semibold">Status:</span>{" "}
        <span
          className={restaurant.is_open ? "text-green-600" : "text-red-600"}
        >
          {restaurant.is_open ? "Open" : "Closed"}
        </span>
      </p>
      <p className="text-gray-700 mb-1">
        <span className="font-semibold">Address:</span>{" "}
        {restaurant.address.street}, {restaurant.address.city},{" "}
        {restaurant.address.zipcode}
      </p>
      <p className="text-gray-700 mb-1">
        <span className="font-semibold">Created:</span>{" "}
        {new Date(restaurant.created_at).toLocaleDateString()}
      </p>

      <div className="mt-3">
        <span className="font-semibold">Tags:</span>
        <div className="mt-1 flex flex-wrap gap-2">
          {restaurant.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetailed;
