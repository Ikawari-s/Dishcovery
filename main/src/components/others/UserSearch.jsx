import React, { useState } from "react";
import { searchUsers } from "../../api/authenticationsApi";
import { Link } from "react-router-dom";
function UserSearch() {
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
      const users = await searchUsers(query);
      setResults(users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="border p-2 rounded w-full text-black"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {loading && <p className="mt-2">Searching...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}

      <ul className="mt-4 space-y-2">
        {results.map((user) => (
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
  );
}

export default UserSearch;
