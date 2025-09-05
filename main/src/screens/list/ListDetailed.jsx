// src/components/ListDetailed.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { deleteListApi, getListById } from "../../api/listApi";
import DeleteListModal from "../../components/modals/DeleteListModal";
import RestaurantCard from "../../components/cards/RestaurantCard";
import { FaTrash, FaArrowLeft } from "react-icons/fa";

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

  if (loading) return <p className="text-center mt-10">Loading list...</p>;
  if (!list) return <p className="text-center mt-10">List not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-12 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-10 border-b border-gray-700 pb-6">
          <h1 className="text-5xl font-bold mb-4">{list.name}</h1>
          <p className="text-lg mb-2">{list.description}</p>
          <p className="text-sm">Created by: <span className="font-medium">{list.createdBy.name}</span></p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              to="/lists"
              className="inline-flex items-center text-sm text-yellow-400 hover:underline"
            >
              <FaArrowLeft className="mr-1" />
              Back to all lists
            </Link>

            {userId === list.createdBy._id && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                <FaTrash className="mr-2" />
                Delete List
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left - Restaurants */}
          <div className="lg:col-span-3">
            <h2 className="text-3xl font-semibold mb-4">Restaurants</h2>
            {list.restaurants.length === 0 ? (
              <p className="text-gray-400 italic">No restaurants added yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {list.restaurants.map((r) => (
                  <div key={r._id} className="relative">
                    <RestaurantCard
                      id={r.restaurantId._id}
                      name={r.restaurantId.name}
                      image={r.restaurantId.image}
                      cuisine={r.restaurantId.cuisine}
                    />
                    <div className="mt-2 text-sm bg-yellow-50 dark:bg-gray-800 rounded-lg p-3 shadow hover:shadow-lg transition duration-300 min-h-28 flex flex-col justify-center">
                    {r.rank && (<p className="text-yellow-600 dark:text-yellow-400 font-semibold">Rank: {r.rank}</p>)}
                      {r.notes && (<p className="italic text-gray-800 dark:text-gray-300">"{r.notes}"</p>)}
                  </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right - Tags */}
          <div>
            <h2 className="text-3xl font-semibold mb-4">Tags</h2>
            {list.tags.length === 0 ? (
              <p className="text-gray-400 italic">No tags added.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {list.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-sm font-medium px-3 py-1 rounded-full bg-yellow-100 text-gray-800 dark:bg-gray-700 dark:text-white shadow"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete Modal */}
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
