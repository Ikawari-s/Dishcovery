import React, { useState } from "react";
import ListRestaurantSearch from "../../components/lists/ListRestaurantSearch";

function NewList() {
  const [name, setName] = useState("");
  const [tags, setTags] = useState([]); // array of tags
  const [tagInput, setTagInput] = useState(""); // current input
  const [description, setDesription] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(name, tags, description);
  };
  return (
    <div>
      <ListRestaurantSearch />
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
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewList;
