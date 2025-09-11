import React, { useState, useEffect } from "react";

import ChangePass from "../components/settings/ChangePass";
import ProfileSettings from "../components/settings/ProfileSettings";
import VerifyAccount from "../components/settings/VerifyAccount";
import Avatar from "../components/settings/Avatar";
import UserCard from "../components/cards/UserCard";
import { getUserProfileApi } from "../api/usersApi"; // Adjust path if needed

function Settings() {
  return (
    <div>
      <TailwindTabs />
    </div>
  );
}

export default Settings;

function TailwindTabs() {
  // State to keep track of the active tab
  const [activeTab, setActiveTab] = useState("profile");

  // State for userProfile
  const [userProfile, setUserProfile] = useState(null);

  // Replace this with actual userId (from auth context or props)
  const storedUser = localStorage.getItem("userInfo");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user ? user._id : null;

  // Fetch user profile when component mounts or userId changes
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfileApi(userId);
        setUserProfile(data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err.message);
      }
    };
    fetchProfile();
  }, [userId]);

  // Function to handle tab click
  const handleTabClick = (tab) => {
    if (tab !== "disabled") {
      setActiveTab(tab);
    }
  };

  return (
    <div className="">
      <ul className="flex flex-wrap justify-center -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        {/* Profile Tab */}
        <li className="me-2">
          <a
            href="#"
            onClick={() => handleTabClick("profile")}
            className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
              activeTab === "profile"
                ? "border-blue-600 text-blue-600 bg-gray-100 dark:bg-gray-800 dark:text-blue-500"
                : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
            }`}
          >
            <svg
              className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
            Profile
          </a>
        </li>

        {/* Dashboard Tab */}
        <li className="me-2">
          <a
            href="#"
            onClick={() => handleTabClick("dashboard")}
            className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
              activeTab === "dashboard"
                ? "border-blue-600 text-blue-600 bg-gray-100 dark:bg-gray-800 dark:text-blue-500"
                : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
            }`}
          >
            <svg
              className="w-4 h-4 me-2 text-blue-600 dark:text-blue-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 18"
            >
              <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
            </svg>
            Change Password
          </a>
        </li>

        {/* Verify Tab */}
        <li className="me-2">
          <a
            href="#"
            onClick={() => handleTabClick("settings")}
            className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
              activeTab === "settings"
                ? "border-blue-600 text-blue-600 bg-gray-100 dark:bg-gray-800 dark:text-blue-500"
                : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
            }`}
          >
            {/* New Shield Checkmark SVG */}
            <svg
              className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m1-3v6a9 9 0 11-8 0V6a9 9 0 018 0z"
              />
            </svg>
            Verify
          </a>
        </li>

        {/* Preview Tab */}
        <li className="me-2">
          <a
            href="#"
            onClick={() => handleTabClick("avatar")}
            className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
              activeTab === "avatar"
                ? "border-blue-600 text-blue-600 bg-gray-100 dark:bg-gray-800 dark:text-blue-500"
                : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
            }`}
          >
            {/* New Eye (Preview) SVG */}
            <svg
              className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
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
            Preview
          </a>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "profile" && (
          <div className="w-fit p-4 rounded-xl bg-white/40 dark:bg-gray-900/70 backdrop-blur-md shadow-xl mx-auto mt-4">
            <h2 className="text-4xl mt-4 font-bold mb-12 text-center">Profile Settings</h2>
            <div className="flex items-start gap-6">
              <Avatar />
              <ProfileSettings />
            </div>
          </div>

        )}
        {activeTab === "dashboard" && (
          <div className="w-fit p-4 rounded-xl bg-white/40 dark:bg-gray-900/70 backdrop-blur-md shadow-xl mx-auto mt-4">
            {" "}
            <ChangePass />
          </div>
        )}
        {activeTab === "settings" && (
          <div className="w-fit p-4 rounded-xl bg-white/40 dark:bg-gray-900/70 backdrop-blur-md shadow-xl mx-auto mt-4">
            <VerifyAccount />
          </div>
        )}
        {activeTab === "avatar" && (
          <div className="w-fit p-4 rounded-xl bg-white/40 dark:bg-gray-900/70 backdrop-blur-md shadow-xl mx-auto mt-4">
            <UserCard user={user} />
          </div>
        )}
      </div>
    </div>
  );
}
