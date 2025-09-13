import React, { useState } from "react";
import ListRestaurantSearch from "../../components/lists/ListRestaurantSearch";
import { createListApi } from "../../api/listApi";
import { useNavigate } from "react-router-dom";

function NewList() {
  const [name, setName] = useState("");
  const [tags, setTags] = useState([]); // array of tags
  const [tagInput, setTagInput] = useState(""); // current input
  const [description, setDesription] = useState("");
  const [restaurants, setRestaurants] = useState([]); // 🔹 from child
  const [isRanked, setIsRanked] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name.trim() || restaurants.length === 0) {
      alert("Name and at least one restaurant are required.");
      return;
    }

    const listData = {
      name,
      description,
      tags,
      isRanked,
      restaurants: restaurants.map((r, idx) => ({
        restaurantId: r._id,
        notes: r.notes || "",
        rank: isRanked ? idx + 1 : null,
      })),
    };

    try {
      setLoading(true);
      const created = await createListApi(listData, userInfo.token);
      console.log("✅ List created:", created);
      navigate(`/lists/${created._id}`);
    } catch (err) {
      console.error(
        "❌ Error creating list:",
        err.response?.data || err.message
      );
      alert("Failed to create list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl w-full p-6 sm:p-8 md:p-12 rounded-xl bg-white/40 dark:bg-gray-900/70 backdrop-blur-md shadow-xl mx-auto transition-all duration-300 mt-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        New List
      </h2>

      <ListRestaurantSearch
        selectedRestaurants={restaurants}
        setSelectedRestaurants={setRestaurants}
      />

      <form className="max-w-full mx-auto mt-6" onSubmit={submitHandler}>
        <div className="mb-6">
          <label
            htmlFor="base-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            id="base-input"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

          {restaurants.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-4">Restaurant Notes</h3>
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {restaurants.map((r, idx) => (
                  <div key={r._id} className="flex flex-col gap-1">
                    <span className="block font-semibold truncate">{r.name}</span>
                    <input
                      type="text"
                      placeholder="Add notes..."
                      value={r.notes || ""}
                      onChange={(e) => {
                        const newRestaurants = [...restaurants];
                        newRestaurants[idx].notes = e.target.value;
                        setRestaurants(newRestaurants);
                      }}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 w-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label
            htmlFor="tags-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Tags
          </label>
          <input
            type="text"
            id="tags-input"
            placeholder="Type tag and press Enter or Tab"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Tab") {
                e.preventDefault();
                if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                  setTags([...tags, tagInput.trim()]);
                }
                setTagInput("");
              }
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

          {/* Display tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm cursor-pointer select-none"
                title="Click to remove"
                onClick={() => setTags(tags.filter((t) => t !== tag))}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDesription(e.target.value)}
            id="description"
            rows="4"
            placeholder="Type a description"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
          ></textarea>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            checked={isRanked}
            onChange={(e) => setIsRanked(e.target.checked)}
            id="ranked-checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="ranked-checkbox" className="text-sm select-none dark:text-white">
            Rank this list
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default NewList;
