import React, { useEffect, useState } from "react";
import { requestOtpApi, verifyOtpApi } from "../../api/authenticationsApi";

export default function VerifyAccount() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.email) setEmail(user.email);
    }
  }, []);

  const requestOtp = async (e) => {
    e.preventDefault();
    setRequestLoading(true);
    setMessage("");
    try {
      const res = await requestOtpApi(email);
      setIsSuccess(true);
      setMessage(res.message);
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.message);
    } finally {
      setRequestLoading(false);
    }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    setVerifyLoading(true);
    setMessage("");
    try {
      const res = await verifyOtpApi(email, otp);
      setIsSuccess(true);
      setMessage(res.message);
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.message);
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold mb-4">Verify Account</h2>
        {message && (
          <div
            className={`flex items-center p-4 mb-4 text-sm border rounded-lg ${
              isSuccess
                ? "text-green-800 border-green-300 bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
                : "text-red-800 border-red-300 bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
            }`}
            role="alert"
          >
            <div>
              <span className="font-medium">
                {isSuccess ? "Success!" : "Error!"}
              </span>{" "}
              {message}
            </div>
          </div>
        )}
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
            disabled={requestLoading}
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
            disabled={verifyLoading}
          >
            {loading ? "Verifying OTP" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
