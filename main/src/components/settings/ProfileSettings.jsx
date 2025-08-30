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
      const token = user?.token; // <-- get token from localStorage user
      if (!token) throw new Error("User not authenticated");

      const updatedUser = await updateProfileApi(profileData, token);
      console.log("Profile updated:", updatedUser);

      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...updatedUser, token })
      );
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold mb-4">Profile</h2>

        <form class="max-w-sm mx-auto" onSubmit={handleSubmit}>
          <div class="mb-5">
            <label
              for="base-input"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              type="text"
              id="base-input"
              class="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              disabled
            />
          </div>
          <div className="mb-5 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="givenName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Given name
              </label>
              <input
                type="text"
                id="givenName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={givenName}
                onChange={(e) => setGivenName(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="familyName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Family name
              </label>
              <input
                type="text"
                id="familyName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
              />
            </div>
          </div>
          <div class="mb-5">
            <label
              for="base-input"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email address
            </label>
            <input
              type="text"
              id="base-input"
              class="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
          </div>
          <div className="mb-5 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="givenName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Location
              </label>
              <input
                type="text"
                id="givenName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="familyName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Website
              </label>
              <input
                type="text"
                id="familyName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>
          <label
            for="message"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Bio
          </label>
          <textarea
            id="message"
            rows="4"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Type your bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSettings;
