// src/components/ListDetailed.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { deleteListApi, getListById } from "../../api/listApi";
import DeleteListModal from "../../components/modals/DeleteListModal";
import RestaurantCard from "../../components/cards/RestaurantCard";
function ListDetailed() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?._id;

  useEffect(() => {
    const fetchList = async () => {
      try {
        const data = await getListById(id);
        setList(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteListApi(id, userInfo.token);
      setShowDeleteModal(false);
      navigate("/lists");
    } catch (error) {
      console.error("Error deleting list:", error);
      alert("Failed to delete list. Please try again.");
    }
  };

  if (loading) return <p>Loading list...</p>;
  if (!list) return <p>List not found.</p>;

  return (
    <div
        className="mx-80"
        style={{
          background: `
            linear-gradient(
              to right,
              rgba(17, 24, 39, 0) 0%,
              rgba(17, 24, 39, 0.7) 20%,
              rgba(17, 24, 39, 1) 40%,
              rgba(17, 24, 39, 1) 60%,
              rgba(17, 24, 39, 0.7) 80%,
              rgba(17, 24, 39, 0) 100%
            )
          `,
        }}
      >

      <div className="px-6 text-start">
        <h1 className="text-8xl font-bold text-gray-900 dark:text-white mb-4">{list.name}</h1>
        <p className="text-lg text-gray-900 dark:text-white mb-2 mx-1">{list.description}</p>
        <p className="text-md text-gray-900 dark:text-white mx-1">By: {list.createdBy.name}</p>

        {userId === list.createdBy._id && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="mt-5 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete List
          </button>
        )}

        {/* Back Link */}
        <Link
          to="/lists"
          className="mt-5 inline-block text-gray-900 dark:text-white hover:underline"
        >
          ← Back to all lists
        </Link> 
      </div>
      <div className="flex flex-col lg:flex-row">
        
        <div className="flex-1 p-2">
        {/* {list.isRanked && (
          <h4 className="mb-4 upper case font-bold text-xl text-gray-900 dark:text-white">Ranked List</h4>
        )} */}

        <h2 className="text-4xl font-semibold mb-3">Restaurants</h2>

        {/* ✅ Restaurants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {list.restaurants.map((r) => (
            <div key={r._id} className="relative">
              <RestaurantCard
                id={r.restaurantId._id}
                name={r.restaurantId.name}
                image={r.restaurantId.image}
                cuisine={r.restaurantId.cuisine}
              />

              {/* ✅ Optional Info Below Card */}
              <div className="mt-2 text-sm shadow-lg bg-yellow-50 dark:bg-gray-800 rounded-lg p-2 transition-all duration-300 hover:bg-yellow-100 hover:dark:bg-gray-800 hover:-translate-y-1">
                {r.rank && <p className="text-gray-700">Rank: {r.rank}</p>}
                {r.notes && <p className="italic text-gray-600">"{r.notes}"</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section (Tags) */}
      <div className="w-full lg:w-1/4 p-2">
        <h2 className="text-4xl font-semibold mb-3">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {list.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-sm font-semibold px-4 py-1 rounded-md bg-yellow-50 text-gray-800 dark:bg-gray-800 dark:text-gray-100 shadow-lg transition-all duration-300 hover:bg-yellow-100 hover:dark:bg-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Modal */}
      <DeleteListModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleDelete={handleDelete}
      />
    </div>
    </div>
  );
}

export default ListDetailed;
