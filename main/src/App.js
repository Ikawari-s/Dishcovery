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
import Feed from "./screens/Feed";
import ForgotPassword from "./screens/ForgotPassword";
import ListDetailed from "./screens/list/ListDetailed";
import RestaurantAllReviews from "./screens/RestaurantAllReviews";
import ScrollToTop from "./components/others/ScrollToTop";
import AdminDashboard from "./screens/admin/AdminDashboard";
import AdminRoute from "./screens/admin/AdminRoute";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <div className="pattern-img-bg"></div>
      <div className="relative text-center text-black dark:text-white min-h-screen overflow-hidden ">
        {loading && <LoadingScreen onFinish={() => setLoading(false)} />}
        <div
          className={`transition-opacity duration-500 ease-in-out ${
            loading ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <Router>
            <ScrollToTop /> {/* Add this here */}
            <Header />
            <Routes>
              <Route element={<Home />} path="/" />
              <Route element={<Restaurants />} path="/restaurants" />
              <Route element={<Authentication />} path="/authentication" />
              <Route element={<ReviewDetailed />} path="/review/:id" />
              <Route element={<RestaurantDetailed />} path="/restaurant/:id" />
              <Route
                element={<RestaurantAllReviews />}
                path="/restaurant/:id/reviews"
              />
              <Route element={<ProfileRouter />} path="/profile/:id" />
              <Route element={<Lists />} path="/lists" />
              <Route element={<ForgotPassword />} path="/forgot-password" />
              <Route element={<ListDetailed />} path="/list/:id" />
              <Route element={<AdminRoute />}>
                <Route element={<AdminDashboard />} path="/admin" />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route element={<Feed />} path="/feed" />
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
