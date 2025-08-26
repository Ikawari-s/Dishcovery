import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRestaurants } from "../api/restaurantsApi"; // ✅ Make sure the path is correct
import Spinner from "../components/others/Spinner";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Link to={`/restaurant/${restaurant._id}`}>
                  <img
                    className="rounded-t-lg w-full h-48 object-cover"
                    src={restaurant.image}
                    alt={restaurant.name}
                  />
                  <div className="p-5">
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                      {restaurant.name}
                    </h5>
                    <p className="font-normal text-gray-700">
                      Cuisine: {restaurant.cuisine}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No restaurants found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Restaurants;
