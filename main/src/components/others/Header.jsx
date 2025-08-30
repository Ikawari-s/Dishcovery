import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Header() {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");

    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/authentication");
  };

  const getNavLinkClass = (path, isDynamic = false) => {
    const isActive = isDynamic
      ? location.pathname.startsWith(path)
      : location.pathname === path;

    return `block pt-2 pb-4 px-3 md:p-0 mb-1 border-b-4 ${
      isActive ? "border-red-500" : "border-transparent hover:border-red-400"
    } text-xl font-body text-gray-900 dark:text-white md:hover:border-red-400 transition-all duration-300`;
  };

  return (
    <div>
      <nav className="bg-yellow-50 border-gray-200 dark:bg-gray-900 ">
        <div className="w-[95%] mx-auto flex flex-wrap items-center justify-between p-4">
          <Link
            className="self-center text-5xl font-logo whitespace-nowrap dark:text-white"
            to="/"
          >
            Dishcovery
          </Link>

          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 dark:text-white font-body">
                  {user.email}
                </span>
                <img
                  src={
                    user.profilePicture
                      ? `http://localhost:5000${user.profilePicture}`
                      : "/images/default.jpg"
                  }
                  className="w-8 h-8 rounded-full object-cover"
                  alt="User"
                />
                <button onClick={handleLogout} className="font-body">
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/authentication"
                className="font-medium text-red-600 dark:text-red-400 font-body"
              >
                Login
              </Link>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-yellow-50 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link to="/" className={getNavLinkClass("/")}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/settings" className={getNavLinkClass("/settings")}>
                  Settings
                </Link>
              </li>
              <li>
                <Link to="/feed" className={getNavLinkClass("/settings")}>
                  Feed
                </Link>
              </li>
              <li>
                <Link
                  to="/restaurants"
                  className={getNavLinkClass("/restaurants")}
                >
                  Restaurants
                </Link>
              </li>
              {user && (
                <li>
                  <Link
                    to={`/profile/${user._id}`}
                    className={getNavLinkClass("/profile", true)}
                  >
                    Profile
                  </Link>
                </li>
              )}
              <li>
                <Link to="/lists" className={getNavLinkClass("/lists")}>
                  Lists
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
