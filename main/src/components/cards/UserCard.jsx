import React from "react";

function UserCard({ user }) {
  if (!user) return null; // prevent rendering if no user

  return (
    <div>
      <a
        href="#"
        className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <img
          className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
          src={`http://localhost:5000${user.profilePicture}`}
          alt={user.name}
        />
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {user.givenName || user.familyName
              ? `${user.givenName} ${user.familyName}`
              : user.name}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {user.location || "-"}
          </p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {user.website || "-"}
          </p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {user.bio || "-"}
          </p>
        </div>
      </a>
    </div>
  );
}

export default UserCard;
