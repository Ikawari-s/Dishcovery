import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { listRestaurantSearch } from "../../api/restaurantsApi";

// Sortable item component
function SortableItem({ restaurant, toggleSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: restaurant._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-3 p-2 border rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
    >
      <img
        src={restaurant.image || "https://via.placeholder.com/40"}
        alt={restaurant.name}
        className="w-10 h-10 rounded object-cover flex-shrink-0"
      />
      <span className="font-medium truncate">{restaurant.name}</span>
      <button
        onClick={() => toggleSelect(restaurant)}
        className="ml-auto text-red-500 hover:text-red-700 text-sm flex-shrink-0"
        aria-label={`Remove ${restaurant.name}`}
      >
        ✕
      </button>
    </li>
  );
}

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
      setSelectedRestaurants((prev) =>
        prev.filter((r) => r._id !== restaurant._id)
      );
    } else {
      setSelectedRestaurants((prev) => [...prev, restaurant]);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = selectedRestaurants.findIndex(
        (r) => r._id === active.id
      );
      const newIndex = selectedRestaurants.findIndex((r) => r._id === over?.id);

      setSelectedRestaurants((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setError("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center md:p-10 shadow-sm max-w-full md:max-w-4xl mx-auto text-gray-700 dark:text-gray-400">
      <div className="w-full">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-2 mb-4 relative"
        >
          <div className="relative w-full sm:w-auto flex-grow">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Restaurant"
              className="border p-2 pr-8 rounded w-full text-black dark:text-black"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-bold text-xl leading-none"
              >
                ×
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-shrink-0"
          >
            Search
          </button>
        </form>

        {loading && <p className="mt-2">Searching...</p>}
        {error && <p className="mt-2 text-red-500">{error}</p>}

        {/* Search Results */}
        <ul className="space-y-2 mb-6 max-h-80 overflow-auto scroll-container">
          {results.map((restaurant) => {
            const isSelected = selectedRestaurants.some(
              (r) => r._id === restaurant._id
            );

            return (
              <li
                key={restaurant._id}
                onClick={() => toggleSelect(restaurant)}
                className={`p-3 px-6 bg-yellow-50 dark:bg-gray-900 rounded flex flex-col sm:flex-row items-center sm:items-start gap-3 cursor-pointer transition dark:text-white ${
                  isSelected
                    ? "bg-yellow-100 dark:bg-gray-500"
                    : "hover:bg-yellow-100 dark:hover:bg-gray-700"
                }`}
              >
                <img
                  src={
                    restaurant.image
                      ? restaurant.image
                      : "https://via.placeholder.com/60"
                  }
                  alt={restaurant.name}
                  className="w-16 h-16 rounded object-cover flex-shrink-0"
                />
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-lg truncate max-w-xs sm:max-w-sm">
                    {restaurant.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs sm:max-w-sm">
                    {restaurant.cuisine}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-400 truncate max-w-xs sm:max-w-sm">
                    {restaurant.address.city}, {restaurant.address.zipcode}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Selected Restaurants */}
        <h3 className="mb-2 font-semibold">Selected Restaurants</h3>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={selectedRestaurants.map((r) => r._id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2 max-h-72 overflow-auto">
              {selectedRestaurants.map((r) => (
                <SortableItem
                  key={r._id}
                  restaurant={r}
                  toggleSelect={toggleSelect}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export default ListRestaurantSearch;
