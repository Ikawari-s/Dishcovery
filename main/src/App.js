import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

import Home from "./screens/Home";
import Restaurants from "./screens/Restaurants";
import Authentication from "./screens/Authentication";
import Header from "./components/others/Header";
import RestaurantDetailed from "./screens/RestaurantDetailed";
import ReviewDetailed from "./screens/ReviewDetailed";
import Lists from "./screens/list/Lists";
import ProfileRouter from "./screens/profile/ProfileRouter";
import LoadingScreen from "./components/others/LoadingScreen";
import ProtectedRoute from "./components/others/ProtectedRoute";
import Settings from "./screens/Settings";
import NewList from "./screens/list/NewList";

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
              <Route element={<ProtectedRoute />}>
                <Route element={<Settings />} path="/settings" />
                <Route element={<NewList />} path="/list/new" />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </div>
      </div>
    </>
  );
}

export default App;
