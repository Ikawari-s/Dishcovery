import React, { useState } from "react";
import { Link } from "react-router-dom";
import { searchRestaurants } from "../../api/restaurantsApi";
import { searchUsers } from "../../api/usersApi";

function DualSearch() {
  const [restaurantQuery, setRestaurantQuery] = useState("");
  const [userQuery, setUserQuery] = useState("");

  const [restaurantResults, setRestaurantResults] = useState([]);
  const [userResults, setUserResults] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    // Optional: prevent search if both fields are empty
    if (!restaurantQuery.trim() && !userQuery.trim()) return;

    setLoading(true);

    try {
      const [restaurants, users] = await Promise.all([
        restaurantQuery.trim() ? searchRestaurants(restaurantQuery) : Promise.resolve([]),
        userQuery.trim() ? searchUsers(userQuery) : Promise.resolve([]),
      ]);

      setRestaurantResults(restaurants);
      setUserResults(users);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={restaurantQuery}
            onChange={(e) => setRestaurantQuery(e.target.value)}
            placeholder="Search restaurants..."
            className="border p-2 rounded w-full text-black"
          />
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Search users..."
            className="border p-2 rounded w-full text-black"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 rounded hover:bg-purple-700"
          >
            Search Both
          </button>
        </div>
      </form>

      {loading && <p className="mt-4">Searching...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="mt-6 flex gap-6">
        {/* Restaurant Results */}
        <div className="w-1/2">
          <h2 className="text-lg font-semibold mb-2">Restaurants</h2>
          <ul className="space-y-2">
            {restaurantResults.map((restaurant) => (
              <li
                key={restaurant._id}
                className="p-2 border rounded flex items-center gap-3"
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
        </div>

        {/* User Results */}
        <div className="w-1/2">
          <h2 className="text-lg font-semibold mb-2">Users</h2>
          <ul className="space-y-2">
            {userResults.map((user) => (
              <li
                key={user._id}
                className="p-2 border rounded flex items-center gap-3"
              >
                <img
                  src={
                    user.profilePicture
                      ? `http://localhost:5000${user.profilePicture}`
                      : "https://via.placeholder.com/40"
                  }
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <Link to={`/profile/${user._id}`} className="font-semibold">
                    {user.name}
                  </Link>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DualSearch;
