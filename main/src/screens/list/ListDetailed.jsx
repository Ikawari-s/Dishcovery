// src/components/ListDetailed.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { deleteListApi, getListById } from "../../api/listApi";
import DeleteListModal from "../../components/modals/DeleteListModal";

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
      await deleteListApi(id, userInfo.token); // pass listId and token
      setShowDeleteModal(false);
      navigate("/lists"); // redirect after deleting
    } catch (error) {
      console.error("Error deleting list:", error);
      alert("Failed to delete list. Please try again.");
    }
  };

  if (loading) return <p>Loading list...</p>;
  if (!list) return <p>List not found.</p>;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-2">{list.name}</h1>
      <p className="text-gray-600 mb-2">{list.description}</p>
      <p className="text-sm mb-4">By: {list.createdBy.name}</p>

      <div className="flex flex-wrap gap-2 mb-4">
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
        <p className="mb-4 text-sm text-gray-500">Ranked List</p>
      )}

      <h2 className="text-2xl font-semibold mb-3">Restaurants</h2>
      <div className="space-y-4">
        {list.restaurants.map((r) => (
          <div key={r._id} className="flex items-center gap-4 border-t pt-2">
            <img
              src={r.restaurantId.image}
              alt={r.restaurantId.name}
              className="w-20 h-20 object-cover rounded"
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

      {userId === list.createdBy._id && (
        <button
          onClick={() => setShowDeleteModal(true)}
          className="mt-5 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete List
        </button>
      )}

      <Link
        to="/lists"
        className="mt-5 inline-block text-blue-600 hover:underline"
      >
        ← Back to all lists
      </Link>
      <DeleteListModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default ListDetailed;
