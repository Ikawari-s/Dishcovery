import React, { useState } from "react";
import { registerUser } from "../api/authenticationsApi";
import { Filter } from "bad-words";
import PasswordChecklist from "react-password-checklist";

function RegisterUser({ setShowRegister }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPass, setShowPass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [showColdStartAlert, setShowColdStartAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filter = new Filter();

    if (filter.isProfane(username)) {
      setIsSuccess(false);
      setMessage("Username contains offensive words");
      return;
    }

    if (!isValidPassword) {
      setIsSuccess(false);
      setMessage("Password does not meet requirements");
      return;
    }

    try {
      setLoading(true);

      const timer = setTimeout(() => {
        setShowColdStartAlert(true);
      }, 3000);

      const data = await registerUser({
        name: username,
        email,
        password,
      });

      clearTimeout(timer);
      setShowColdStartAlert(false);

      setMessage("Registration successful!");
      console.log("Registered user:", data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setIsSuccess(true);

      // Refresh the page after successful registration with a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessage(err.message);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Create Account</h2>
      {loading && showColdStartAlert && (
        <div
          className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
          role="alert"
        >
          <span className="font-medium">Please wait...</span> The server is
          starting due to long inactivity. This may take a few moments.
        </div>
      )}
      {message && isSuccess && (
        <div
          className="w-lg flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
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
            htmlFor="registerEmail"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="registerEmail"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@flowbite.com"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="registerUsername"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Username
          </label>
          <input
            type="text"
            id="registerUsername"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="martinroque"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="registerPassword"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <input
            type={showPass ? "text" : "password"}
            id="registerPassword"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="registerPassword2"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Confirm Password
          </label>
          <input
            type={showPass ? "text" : "password"}
            id="registerPassword2"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>

        <PasswordChecklist
          rules={["minLength", "number", "capital", "match"]}
          minLength={8}
          value={password}
          valueAgain={password2}
          onChange={(isValid) => setIsValidPassword(isValid)}
          messages={{
            minLength: "Password has at least 8 characters.",
            number: "Password has a number.",
            capital: "Password has a capital letter.",
            match: "Passwords match.",
          }}
        />

        <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input
              id="registerShowPass"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              checked={showPass}
              onChange={() => setShowPass(!showPass)}
            />
          </div>
          <label
            htmlFor="showpass"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Show Password
          </label>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          disabled={loading}
        >
          {loading ? "Creating Account" : "Create Account"}
        </button>
        <div className="mt-4 text-center">
          <div
            onClick={() => setShowRegister(false)}
            className="text-sm text-blue-600 hover:underline dark:text-blue-500 cursor-pointer"
          >
            Already have an account? Login
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterUser;
