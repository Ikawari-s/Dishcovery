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

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setError("");
    setLoading(false);
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
        <form onSubmit={handleSearch} className="flex gap-2 relative">
          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search restaurants, cuisine..."
              className="bg-yellow-100 dark:bg-gray-800 dark:text-white p-2 rounded w-full text-gray-800 shadow-xl pr-16"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="absolute right-3 top-[40%] -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-bold text-xl leading-none"
                style={{ lineHeight: 1 }}
              >
                ×
              </button>
            )}
            {loading && (
              <span className="absolute right-10 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                Searching...
              </span>
            )}
          </div>

          <button
            type="submit"
            className="rounded-full flex items-center justify-center p-2 px-2.5 hover:bg-yellow-500 bg-yellow-400 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-800 text-white"
            aria-label="Search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>

        {error && <p className="mt-2 text-red-500">{error}</p>}

        {results.length > 0 && (
          <ul
            className={`text-left absolute left-0 right-0 mt-2 bg-yellow-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto`}
          >
            {results.map((restaurant) => (
              <li
                key={restaurant._id}
                className="p-2 border-b border-gray-300 dark:border-gray-700 last:border-none flex items-center gap-3 hover:bg-yellow-100 dark:hover:bg-gray-700 transition"
              >
                <img
                  src={
                    restaurant.image
                      ? restaurant.image
                      : "https://via.placeholder.com/60"
                  }
                  alt={restaurant.name}
                  className="w-16 h-16 rounded object-cover"
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
