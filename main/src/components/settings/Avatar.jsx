import React, { useState } from "react";
import { uploadProfilePictureApi } from "../../api/usersApi";
import ChangeProfilePicModal from "../modals/ChangeProfilePicModal";

function Avatar() {
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState("");

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ Get token from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  const handleConfirm = async (file) => {
    if (!file || !token) {
      setMessage("You must be logged in to upload!");
      setIsSuccess(false);
      return;
    }

    try {
      const data = await uploadProfilePictureApi(file, token);
      const fullUrl = `http://localhost:5000${data.imageUrl}`;

      // ✅ Update localStorage userInfo with new profilePicture
      const updatedUserInfo = {
        ...userInfo,
        profilePicture: data.imageUrl, // keep relative in storage
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

      setPreview(fullUrl);
      setMessage("Profile picture uploaded successfully!");
      setIsSuccess(true);

      setShowModal(false);
      window.location.reload(); // optional
    } catch (err) {
      console.error(err.message);
      setMessage(err.message);
      setIsSuccess(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* ✅ Success/Error messages */}
      {message && isSuccess && (
        <div
          className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 
                     rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
          role="alert"
        >
          <span className="font-medium">Success!</span> {message}
        </div>
      )}

      {message && !isSuccess && (
        <div
          className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 
                     rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
          role="alert"
        >
          <span className="font-medium">Error!</span> {message}
        </div>
      )}

      {/* Current Avatar */}
      <img
        src={
          userInfo?.profilePicture
            ? `${process.env.REACT_APP_API_BASE_URL}${userInfo.profilePicture}`
            : "/images/default.jpg"
        }
        alt={userInfo?.name}
        className="w-20 h-20 rounded-full border object-cover"
      />

      {/* Change Profile Button */}
      <button
        onClick={() => setShowModal(true)}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Change Profile
      </button>

      {/* Modal */}
      <ChangeProfilePicModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={handleConfirm}
      />
    </div>
  );
}

export default Avatar;
