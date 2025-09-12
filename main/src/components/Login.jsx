import { useEffect, useState } from "react";
import { loginUser } from "../api/authenticationsApi";
import { Link } from "react-router-dom";

function Login({ setShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showColdStartAlert, setShowColdStartAlert] = useState(false);

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("rememberMeData"));
    if (savedCredentials) {
      setEmail(savedCredentials.email || "");
      setPassword(savedCredentials.password || "");
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    try {
      setLoading(true);

      const timer = setTimeout(() => {
        setShowColdStartAlert(true);
      }, 3000);

      const data = await loginUser({ email, password });
      clearTimeout(timer);
      setShowColdStartAlert(false);

      localStorage.setItem("userInfo", JSON.stringify(data));

      if (rememberMe) {
        localStorage.setItem(
          "rememberMeData",
          JSON.stringify({ email, password })
        );
      } else {
        localStorage.removeItem("rememberMeData");
      }

      setMessage("Login successful!");
      setIsSuccess(true);
      window.location.reload();

      console.log("Logged in:", data);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setMessage(error.message);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Login</h2>
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
            htmlFor="loginEmail"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="loginEmail"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@flowbite.com"
            required
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="loginPassword"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <input
            type={showPass ? "text" : "password"}
            id="loginPassword"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input
              id="loginShowPass"
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

        <div className="flex items-center mb-5">
          <input
            id="rememberMe"
            type="checkbox"
            className="w-4 h-4"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Remember Me
          </label>
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Submit"}
        </button>
        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline dark:text-blue-500"
          >
            Forgot your password?
          </Link>
          <div className="mt-4 text-center">
            <div
              onClick={() => setShowRegister(true)}
              className="text-sm text-blue-600 hover:underline dark:text-blue-500 cursor-pointer"
            >
              Don't have an account? Register
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
