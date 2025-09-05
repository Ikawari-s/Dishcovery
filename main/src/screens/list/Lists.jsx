// src/components/Lists.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllListsApi } from "../../api/listApi";
import ListCard from "../../components/cards/ListCard";

function Lists() {
  const [lists, setLists] = useState([]);
  const [user, setUser] = useState(null);
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
        type="submit"
        className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        onClick={() => navigate("/list/new")}
      >
        Start a list
      </button>
      {user && (
        <button
          onClick={() => navigate("/list/new")}
          type="button"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4"
        >
          Create Your Own List
        </button>
      )}
      {lists.length === 0 ? (
        <p>No lists found.</p>
      ) : (
        <div className="flex justify-center w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lists.map((list) => (
              <ListCard key={list._id} list={list} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Lists;
