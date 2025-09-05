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
    <div className="p-5 w-[65vw] mx-auto">
    <div className="flex items-center justify-between px-4 mb-4 w-2xl">
      <h1 className="text-4xl font-bold">Lists</h1>
      <button
        type="submit"
        className="px-8 py-3 bg-yellow-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-yellow-600 transition duration-300"
        onClick={() => navigate("/list/new")}
      >
        Start a list
      </button>
    </div>
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
