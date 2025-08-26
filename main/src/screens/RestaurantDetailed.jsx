import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantsById } from "../api/restaurantsApi";
import RestaurantReviews from "../components/reviews/RestaurantReviews";
import AddReviews from "../components/reviews/AddReviews";

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
    <div className="p-4 flex flex-col items-center space-y-6">
      {/* Restaurant Card */}
      <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-4xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        <img
          className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
          src={restaurant.image || "/placeholder-image.jpg"}
          alt={restaurant.name}
        />
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {restaurant.name}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Cuisine: {restaurant.cuisine}
          </p>
          <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">
            Rating: ⭐ {restaurant.rating} / 5
          </p>
          <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">
            Status:{" "}
            <span
              className={restaurant.is_open ? "text-green-600" : "text-red-600"}
            >
              {restaurant.is_open ? "Open" : "Closed"}
            </span>
          </p>
          <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">
            Address: {restaurant.address.street}, {restaurant.address.city},{" "}
            {restaurant.address.zipcode}
          </p>
        </div>
      </div>

      {/* Reviews Section */}
      <RestaurantReviews restaurantId={id} />
      <AddReviews restaurantId={id} />
    </div>
  );
}

export default RestaurantDetailed;
