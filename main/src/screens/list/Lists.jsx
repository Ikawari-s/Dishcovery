import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllListsApi } from "../../api/listApi";

function Lists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const data = await getAllListsApi();
        setLists(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, []);

  if (loading) return <p>Loading lists...</p>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Lists</h1>

      <button
        onClick={() => navigate("/list/new")}
        type="button"
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4"
      >
        Create Your Own List
      </button>

      {lists.length === 0 ? (
        <p>No lists found.</p>
      ) : (
        <div className="space-y-6">
          {lists.map((list) => (
            <div
              key={list._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer"
            >
              <Link to={`/list/${list._id}`} className="text-xl font-semibold">
                {list.name}
              </Link>
              <p className="text-gray-600">{list.description}</p>
              <p className="text-sm mt-1">By: {list.createdBy.name}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {list.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-200 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {list.isRanked && (
                <p className="mt-2 text-sm text-gray-500">Ranked List</p>
              )}

              {/* Render restaurants */}
              <div className="mt-4 space-y-2">
                {list.restaurants.map((r) => (
                  <div
                    key={r._id}
                    className="flex items-center gap-4 border-t pt-2"
                  >
                    <img
                      src={r.restaurantId.image}
                      alt={r.restaurantId.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{r.restaurantId.name}</p>
                      <p className="text-sm text-gray-500">
                        {r.restaurantId.cuisine} • {r.restaurantId.address.city}
                      </p>
                      {r.rank && <p className="text-sm">Rank: {r.rank}</p>}
                      {r.notes && <p className="text-sm italic">{r.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Lists;
