import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantsById } from "../api/restaurantsApi";
import RestaurantReviews from "../components/reviews/RestaurantReviews";
import AddReviews from "../components/reviews/AddReviews";
import RatingStats from "../components/reviews/RatingStats";

function RestaurantDetailed() {
  const { id } = useParams(); // Get restaurant ID from route
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const heroRef = useRef(null); // Ref for hero section
  const contentRef = useRef(null); // Ref for the section to scroll to

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

  const handleScrollDown = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!restaurant) return null;

  return (
    <div className="p-0 flex flex-col items-center space-y-6 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative w-full h-[92vh] overflow-hidden shadow-[0_60px_50px_20px_rgba(0,0,0,0.748)]"
      >
        <img
          src={restaurant.image || "/placeholder-image.jpg"}
          alt={restaurant.name}
          className="w-full h-full object-cover block"
        />

        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#f3f1de] to-transparent dark:from-[#101725]/100" />

        {/* Text Centered in Hero */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center px-6">
          <h1 className="text-5xl md:text-8xl font-bebas drop-shadow-lg">
            {restaurant.name}
          </h1>
          <p className="mb-2 text-lg">
            <strong>Cuisine:</strong> {restaurant.cuisine}
          </p>
          <p className="mb-2 text-lg">
            <strong>Rating:</strong> ⭐ {restaurant.rating} / 5
          </p>
          <p className="mb-2 text-lg">
            <strong>Status:</strong>{" "}
            <span
              className={restaurant.is_open ? "text-green-600" : "text-red-600"}
            >
              {restaurant.is_open ? "Open" : "Closed"}
            </span>
          </p>
          <p className="text-lg">
            <strong>Address:</strong> {restaurant.address.street},{" "}
            {restaurant.address.city}, {restaurant.address.zipcode}
          </p>
        </div>

        {/* Scroll Down Button */}
        <button
          onClick={handleScrollDown}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-yellow-50 dark:bg-gray-900 text-gray-800 dark:text-white px-6 py-2 rounded-full shadow-md hover:bg-yellow-100 dark:hover:bg-gray-800 transition"
        >
          ↓ More
        </button>
      </div>

      {/* Content below Hero */}
      <div ref={contentRef}>
        <RatingStats restaurantId={id} />
        <RestaurantReviews restaurantId={id} />
        <AddReviews restaurantId={id} />
      </div>
    </div>
  );
}

export default RestaurantDetailed;
