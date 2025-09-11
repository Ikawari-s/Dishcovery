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

      const updatedUserInfo = {
        ...userInfo,
        profilePicture: data.imageUrl,
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

  const profileSrc =
    preview ||
    (userInfo?.profilePicture
      ? `${process.env.REACT_APP_API_BASE_URL}${userInfo.profilePicture}`
      : "/images/default.jpg");

  return (
    <div className="space-y-2 text-center">
      {/* ✅ Success/Error messages */}
      {message && (
        <div
          className={`flex items-center p-4 mb-4 text-sm border rounded-lg ${
            isSuccess
              ? "text-green-800 bg-green-50 border-green-300 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
              : "text-red-800 bg-red-50 border-red-300 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
          }`}
          role="alert"
        >
          <span className="font-medium">
            {isSuccess ? "Success!" : "Error!"}
          </span>{" "}
          &nbsp;{message}
        </div>
      )}

      {/* ✅ Clickable Avatar Image */}
      <button
        onClick={() => setShowModal(true)}
        aria-label="Change profile picture"
        className="group"
      >
        <img
          src={profileSrc}
          alt={userInfo?.name || "User avatar"}
          className="w-40 h-40 rounded-full border border-yellow-50 dark:border-gray-800 object-cover cursor-pointer transition transform duration-200 group-hover:scale-105 group-hover:brightness-90"
        />
      </button>

      {/* ✅ Modal for Upload */}
      <ChangeProfilePicModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={handleConfirm}
      />
    </div>
  );
}

export default Avatar;
