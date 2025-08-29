import React, { useState } from "react";
import { uploadProfilePictureApi } from "../../api/usersApi";

function Avatar() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");

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
    if (!file || !token) return alert("You must be logged in to upload!");
    try {
      const data = await uploadProfilePictureApi(file, token);
      const fullUrl = `http://localhost:5000${data.imageUrl}`;
      setUploadedUrl(fullUrl);

      // ✅ Update localStorage userInfo with new profilePicture
      const updatedUserInfo = {
        ...userInfo,
        profilePicture: data.imageUrl, // keep relative in storage
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

      // ✅ Optionally update preview immediately

      setPreview(fullUrl);
      window.location.reload();
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };

  return (
    <div className="space-y-2">
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

      {uploadedUrl && (
        <div className="mt-4">
          <p className="text-sm font-medium">Uploaded:</p>
          <img
            src={uploadedUrl}
            alt="uploaded"
            className="w-32 h-32 object-cover rounded-full border"
          />
        </div>
      )}
      <img
        src={`http://localhost:5000${user.profilePicture}`}
        alt="profile"
        className="w-32 h-32 rounded-full"
      />
    </div>
  );
}

export default Avatar;
