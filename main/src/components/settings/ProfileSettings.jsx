import React, { useEffect, useState } from "react";
import { getUserProfileApi, updateProfileApi } from "../../api/usersApi";

function ProfileSettings() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const storedUser = localStorage.getItem("userInfo");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?._id;

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getUserProfileApi(userId)
        .then((data) => {
          setUserName(data.name || "");
          setGivenName(data.givenName || "");
          setFamilyName(data.familyName || "");
          setEmail(data.email || "");
          setLocation(data.location || "");
          setWebsite(data.website || "");
          setBio(data.bio || "");
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const profileData = { givenName, familyName, location, website, bio };

    try {
      const token = user?.token;
      if (!token) throw new Error("User not authenticated");

      const updatedUser = await updateProfileApi(profileData, token);
      console.log("Profile updated:", updatedUser);

      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...updatedUser, token })
      );

      setMessage("Profile update successfully!");
      setIsSuccess(true);
    } catch (err) {
      console.error(err.message);
      setMessage(err.message || "Failed to update profile");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 pb-6">

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username (read-only) */}
        <div>
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            disabled
            className="bg-yellow-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {/* Name fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="givenName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Given Name
            </label>
            <input
              type="text"
              id="givenName"
              value={givenName}
              onChange={(e) => setGivenName(e.target.value)}
              className="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="familyName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Family Name
            </label>
            <input
              type="text"
              id="familyName"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email Address
          </label>
          <input
            type="text"
            id="email"
            value={email}
            disabled
            className="bg-yellow-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {/* Location and Website */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="location"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="website"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Website
            </label>
            <input
              type="text"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label
            htmlFor="bio"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Bio
          </label>
          <textarea
            id="bio"
            rows="4"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {message && isSuccess && (
        <div
          className="flex items-center p-4 mt-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
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

      {message && !isSuccess && (
        <div
          className="flex items-center p-4 mt-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
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
    </div>
  );
}

export default ProfileSettings;
