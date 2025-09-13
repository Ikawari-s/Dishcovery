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
    <div className="w-fit p-8 rounded-xl bg-white/40 dark:bg-gray-900/70 backdrop-blur-md shadow-xl mx-auto transition-all duration-300 mt-12">
      <h2 className="text-4xl font-bold text-center">
        New List
      </h2>
      <ListRestaurantSearch
        selectedRestaurants={restaurants}
        setSelectedRestaurants={setRestaurants}
      />
      <form class="max-w-sm mx-auto" onSubmit={submitHandler}>
        <div class="mb-5">
          <div class="mb-5">
            <label
              for="base-input"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="base-input"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
                        {restaurants.length > 0 && (
  <div className="mb-5">
    <h3 className="text-sm font-medium mb-2">Restaurant Notes</h3>
    {restaurants.map((r, idx) => (
      <div key={r._id} className="mb-2">
        <span className="block font-semibold">{r.name}</span>
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
)}

          </div>
        </div>
        {/* Tags */}
        <div className="mb-5">
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
              rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
              dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

          {/* Display tags */}
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm cursor-pointer"
                title="Click to remove"
                onClick={() => setTags(tags.filter((t) => t !== tag))}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div>
          <label
            for="message"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Description
          </label>
          <textarea
            val
            value={description}
            onChange={(e) => setDesription(e.target.value)}
            id="description"
            rows="4"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Type a description"
          ></textarea>
        </div>

        <div className="mb-5">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isRanked}
              onChange={(e) => setIsRanked(e.target.checked)}
            />
            <span className="text-sm">Rank this list</span>
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 px-4 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default NewList;
