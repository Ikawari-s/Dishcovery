import React, { useState } from "react";
import { changePasswordApi } from "../../api/authenticationsApi";

function ChangePass() {
  const [currentPass, setCurrentPass] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;

      const res = await changePasswordApi({
        currentPassword: currentPass,
        newPassword,
        token,
      });

      setIsSuccess(true);
      setMessage(res.message || "Password updated successfully");

      // Reset form
      setCurrentPass("");
      setNewPassword("");
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div>
        <h2 className="text-4xl font-bold mb-4">Change Password</h2>
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
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="currentPassword"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                id="currentPassword"
                className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:text-white"
                placeholder="Current Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
              >
                {showPass ? (
                  // 👁 Eye Open
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  // 🙈 Eye Closed
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.255-3.605M6.1 6.1A9.956 9.956 0 012.458 12c1.274 4.057 5.065 7 9.542 7 1.146 0 2.246-.195 3.275-.55M9.88 9.88a3 3 0 104.24 4.24"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="newPassword"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                id="newPassword"
                className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:text-white"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
              >
                {showPass ? (
                  // 👁 Eye Open
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  // 🙈 Eye Closed
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.255-3.605M6.1 6.1A9.956 9.956 0 012.458 12c1.274 4.057 5.065 7 9.542 7 1.146 0 2.246-.195 3.275-.55M9.88 9.88a3 3 0 104.24 4.24"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
            disabled={loading}
          >
            {loading ? "Changing Password..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePass;
