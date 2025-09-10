import React, { useState } from "react";
import { Link } from "react-router-dom";
import { searchRestaurants } from "../../api/restaurantsApi";

function RestaurantSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");
      const restaurants = await searchRestaurants(query);
      setResults(restaurants);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        
        ul::-webkit-scrollbar-track {
          background: transparent;
        }
        ul::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.3);
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        /* Firefox */
        ul {
          scrollbar-color: rgba(0,0,0,0.3) transparent;
        }
      `}</style>

      <div className="max-w-md mr-4 relative">
        {/* parent div needs relative positioning */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search restaurants, cuisine..."
              className="border p-2 rounded w-full text-black pr-20" // space for loading text
            />
            {loading && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                Searching...
              </span>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 rounded hover:bg-green-600"
          >
            Search
          </button>
        </form>

        {error && <p className="mt-2 text-red-500">{error}</p>}

        {results.length > 0 && (
          <ul
            className={`text-left absolute left-0 right-0 mt-2 bg-yellow-50 dark:bg-gray-900 border-none rounded shadow-xl z-50 ${
              results.length > 0 ? "max-h-64 overflow-y-auto" : ""
            }`}
          >
            {results.map((restaurant) => (
              <li
                key={restaurant._id}
                className="p-2 border-b border-gray-100 dark:border-gray-700 last:border-none flex items-center gap-3 hover:bg-yellow-100 dark:hover:bg-gray-700 transition"
              >
                <img
                  src={
                    restaurant.image
                      ? restaurant.image
                      : "https://via.placeholder.com/60"
                  }
                  alt={restaurant.name}
                  className="w-16 h-16 rounded object-cover "
                />
                <div>
                  <Link
                    to={`/restaurant/${restaurant._id}`}
                    className="font-semibold"
                  >
                    {restaurant.name}
                  </Link>
                  <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
                  <p className="text-xs text-gray-400">
                    {restaurant.address.city}, {restaurant.address.zipcode}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default RestaurantSearch;
