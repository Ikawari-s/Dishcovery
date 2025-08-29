import React, { useState } from "react";
import { uploadProfilePictureApi } from "../../api/usersApi";

function Avatar() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [message, setMessage] = useState(""); // For displaying messages
  const [isSuccess, setIsSuccess] = useState(false); // For success/error flag

  // ✅ Get token from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  const storedUser = localStorage.getItem("userInfo");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // local preview
    }
  };

  const handleUpload = async () => {
    if (!file || !token) {
      setMessage("You must be logged in to upload!"); // error message
      setIsSuccess(false); // error state
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

      // ✅ Optionally update preview immediately
      setPreview(fullUrl);
      setMessage("Profile picture uploaded successfully!"); // success message
      setIsSuccess(true); // success state

      // Reload the page to reflect the changes (optional)
      window.location.reload();
    } catch (err) {
      console.error(err.message);
      setMessage(err.message); // error message
      setIsSuccess(false); // error state
    }
  };

  return (
    <div className="space-y-2">
      {message && isSuccess && (
        <div
          className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
          role="alert"
        >
          <svg
            className="shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Success</span>
          <div>
            <span className="font-medium">Success alert!</span> {message}
          </div>
        </div>
      )}

      {/* ❌ Error Message */}
      {message && !isSuccess && (
        <div
          className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
          role="alert"
        >
          <svg
            className="shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Error</span>
          <div>
            <span className="font-medium">Danger alert!</span> {message}
          </div>
        </div>
      )}
      <label
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        htmlFor="file_input"
      >
        Upload Profile Picture
      </label>

      <input
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        aria-describedby="file_input_help"
        id="file_input"
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/gif"
        onChange={handleFileChange}
      />

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="preview"
            className="w-32 h-32 object-cover rounded-full border"
          />
          <button
            onClick={handleUpload}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
}

export default Avatar;
