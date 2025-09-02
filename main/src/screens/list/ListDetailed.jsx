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
    <div className="p-5 flex flex-col lg:flex-row bg-red-100">
      {/* Left Section */}
      <div className="flex-1 bg-blue-100 p-4">
        <h1 className="text-8xl font-bold mb-2">{list.name}</h1>
        <p className="text-gray-600 mb-2">{list.description}</p>
        <p className="text-sm mb-4">By: {list.createdBy.name}</p>

        {list.isRanked && (
          <p className="mb-4 text-sm text-gray-500">Ranked List</p>
        )}

        <h2 className="text-2xl font-semibold mb-3">Restaurants</h2>

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
              <div className="mt-2 text-sm">
                {r.rank && <p className="text-gray-700">Rank: {r.rank}</p>}
                {r.notes && <p className="italic text-gray-600">"{r.notes}"</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Delete Button */}
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
          className="mt-5 inline-block text-blue-600 hover:underline"
        >
          ← Back to all lists
        </Link>
      </div>

      {/* Right Section (Tags) */}
      <div className="w-full lg:w-1/4 bg-green-100 p-4">
        <h3 className="text-lg font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {list.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-200 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
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
  );
}

export default ListDetailed;
