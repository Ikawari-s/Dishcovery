import React, { useEffect, useState } from "react";

export default function VerifyAccount() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const requestOtp = (e) => {
    e.preventDefault();
    // Your OTP request logic here
    console.log("Request OTP for:", email);
  };

  const submitOtp = (e) => {
    e.preventDefault();
    // Your OTP submission logic here
    console.log("Submit OTP:", otp);
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.email) setEmail(user.email);
    }
  }, []);

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold mb-4">Verify Account</h2>

        <form class="max-w-sm mx-auto" onSubmit={requestOtp}>
          <div class="mb-5">
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              disabled
              type="email"
              id="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled={loading}
          >
            {loading ? "Sending to Email" : "Submit"}
          </button>
        </form>

        <form class="max-w-sm mx-auto" onSubmit={submitOtp}>
          <div class="mb-5">
            <label
              for="otp"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              OTP
            </label>
            <input
              type="text"
              id="otp"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled={loading}
          >
            {loading ? "Verifying OTP" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
