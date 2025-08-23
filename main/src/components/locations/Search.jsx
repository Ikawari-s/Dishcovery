import React, { useState } from "react";
import { forwardGeocode } from "../../services/locationServices";

function Search() {
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await forwardGeocode(location);
      if (data && data.length > 0) {
        setResults(data);
      } else {
        alert("No results found");
      }
    } catch (err) {
      console.error("Error fetching location:", err);
    }
  };

  return (
    <div>
      <h1>Search</h1>
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Angeles City"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white p-2 rounded"
        >
          Search
        </button>
      </form>

      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Results:</h2>
          <ul className="space-y-2">
            {results.map((place, index) => (
              <li
                key={index}
                className="border rounded p-2 bg-gray-50 dark:bg-gray-800"
              >
                <p>
                  <strong>Display Name:</strong> {place.display_name}
                </p>
                <p>
                  <strong>Latitude:</strong> {place.lat}
                </p>
                <p>
                  <strong>Longitude:</strong> {place.lon}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Search;
