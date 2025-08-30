import React from "react";

function UserCard() {
  return (
    <div>
      <a
        href="#"
        class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <img
          class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
          src="/images/pic.jpg"
          alt=""
        />
        <div class="flex flex-col justify-between p-4 leading-normal">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            (givenName and/or Family ) if none (username)
          </h5>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
            (location)
          </p>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
            (website)
          </p>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
            (Bio here)
          </p>
        </div>
      </a>
    </div>
  );
}

export default UserCard;
