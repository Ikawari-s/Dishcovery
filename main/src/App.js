import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./screens/Home";
import Restaurants from "./screens/Restaurants";
import Authentication from "./screens/Authentication";
import Header from "./components/others/Header";
import RestaurantDetailed from "./screens/RestaurantDetailed";
import ReviewDetailed from "./screens/ReviewDetailed";
import Profile from "./screens/Profile";
import User from "./screens/User";
import Lists from "./screens/Lists";
import LoadingScreen from "./components/others/LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative text-center p-6 dark:bg-gray-900 text-black dark:text-white min-h-screen overflow-hidden">
      {/* 👇 Loading screen covers the whole app, swipes up on finish */}
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}

      {/* 👇 Always render the app, but fade in when loading finishes */}
      <div
        className={`transition-opacity duration-500 ease-in-out ${
          loading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Router>
          <Header />
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Restaurants />} path="/restaurants" />
            <Route element={<Authentication />} path="/authentication" />
            <Route element={<ReviewDetailed />} path="/review/:id" />
            <Route element={<RestaurantDetailed />} path="/restaurant/:id" />
            <Route element={<User />} path="/user/:id" />
            <Route element={<Profile />} path="/profile" />
            <Route element={<Lists />} path="/lists" />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
