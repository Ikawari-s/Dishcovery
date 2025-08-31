import React, { useState } from "react";

function ChangeProfilePicModal({ show, handleClose, handleConfirm }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  if (!show) return null; // Don't render if modal is closed

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Pass the selected file back when confirmed
  const handleSave = () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }
    handleConfirm(selectedFile);
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-hidden="true"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent 
                       hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 
                       flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>

          {/* Content */}
          <div className="p-4 md:p-5 text-center">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              Change Profile Picture
            </h3>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4"
            />

            {preview && (
              <div className="mb-4 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-full border"
                />
              </div>
            )}

            <button
              onClick={handleSave}
              type="button"
              className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 
                         focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 
                         font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
            >
              Confirm
            </button>
            <button
              onClick={handleClose}
              type="button"
              className="py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 
                         focus:outline-none bg-white rounded-lg border border-gray-200 
                         hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 
                         focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 
                         dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangeProfilePicModal;
