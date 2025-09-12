import React from "react";

function UserCard({ user }) {
  if (!user) return null; // prevent rendering if no user

  return (
    <div className="w-full">
      <div className="text-start flex flex-col items-center p-5 bg-yellow-50 dark:bg-gray-800 border-gray-200 rounded-lg shadow-sm md:flex-row dark:border-gray-700 dark:bg-gray-800 transition-all duration-300">
        <img
          className="w-32 h-32 rounded-full object-cover"
          src={
            user.profilePicture
              ? `${process.env.REACT_APP_API_BASE_URL}${user.profilePicture}`
              : "/images/default.jpg"
          }
          alt={user.name}
        />
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {user.givenName || user.familyName
              ? `${user.givenName} ${user.familyName}`
              : user.name}
          </h5>
          {user.location && (
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {user.location}
            </p>
          )}

          {user.website && (
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {user.website}
            </p>
          )}

          {user.bio && (
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {user.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserCard;
