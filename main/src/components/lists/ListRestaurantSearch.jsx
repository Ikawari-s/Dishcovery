import React, { useState } from "react";
import { listRestaurantSearch } from "../../api/restaurantsApi";

function ListRestaurantSearch({ selectedRestaurants, setSelectedRestaurants }) {
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
      const restaurants = await listRestaurantSearch(query);
      setResults(restaurants);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (restaurant) => {
    const alreadySelected = selectedRestaurants.find(
      (r) => r._id === restaurant._id
    );

    if (alreadySelected) {
      // remove from selected
      setSelectedRestaurants((prev) =>
        prev.filter((r) => r._id !== restaurant._id)
      );
    } else {
      // add without limit
      setSelectedRestaurants((prev) => [...prev, restaurant]);
    }
  };

  const moveRestaurant = (index, direction) => {
    setSelectedRestaurants((prev) => {
      const newArr = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      // Check boundaries
      if (targetIndex < 0 || targetIndex >= newArr.length) return prev;

      // Swap items
      [newArr[index], newArr[targetIndex]] = [
        newArr[targetIndex],
        newArr[index],
      ];
      return newArr;
    });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Restaurant"
          className="border p-2 rounded w-full text-black"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 rounded hover:bg-green-600"
        >
          Search
        </button>
      </form>

      {loading && <p className="mt-2">Searching...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}

      <ul className="mt-4 space-y-2">
        {results.map((restaurant) => {
          const isSelected = selectedRestaurants.some(
            (r) => r._id === restaurant._id
          );

          return (
            <li
              key={restaurant._id}
              onClick={() => toggleSelect(restaurant)}
              className={`p-2 border rounded flex items-center gap-3 cursor-pointer transition ${
                isSelected
                  ? "bg-green-100 border-green-500"
                  : "hover:bg-gray-100"
              }`}
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
                <p className="font-semibold">{restaurant.name}</p>
                <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
                <p className="text-xs text-gray-400">
                  {restaurant.address.city}, {restaurant.address.zipcode}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Show selected restaurants */}
      {selectedRestaurants.map((r, index) => (
        <li key={r._id} className="flex items-center gap-3 p-2 border rounded">
          <img
            src={r.image ? r.image : "https://via.placeholder.com/40"}
            alt={r.name}
            className="w-10 h-10 rounded object-cover"
          />
          <span className="font-medium">{r.name}</span>

          <div className="flex gap-1 ml-auto">
            <button
              onClick={() => moveRestaurant(index, "up")}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              ↑
            </button>
            <button
              onClick={() => moveRestaurant(index, "down")}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              ↓
            </button>
            <button
              onClick={() => toggleSelect(r)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </div>
  );
}

export default ListRestaurantSearch;
