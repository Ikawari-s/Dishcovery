import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./screens/Home";
import Restaurants from "./screens/Restaurants";
import Authentication from "./screens/Authentication";
import Header from "./components/others/Header";
import RestaurantDetailed from "./screens/RestaurantDetailed";
import ReviewDetailed from "./screens/ReviewDetailed";
import Lists from "./screens/Lists";
import ProfileRouter from "./screens/profile/ProfileRouter";
import LoadingScreen from "./components/others/LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* Background pattern with tint and gradient */}
      <div className="pattern-img-bg"></div>

      {/* App content on top of background */}
      <div className="relative text-center p-6 text-black dark:text-white min-h-screen overflow-hidden">
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
              <Route element={<ProfileRouter />} path="/profile/:id" />
              <Route element={<Lists />} path="/lists" />
            </Routes>
          </Router>
        </div>
      </div>
    </>
  );
}


export default App;
