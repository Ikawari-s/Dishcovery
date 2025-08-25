import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Restaurants from "./screens/Restaurants";
import Authentication from "./screens/Authentication";
import Header from "./components/others/Header";
import ReviewDetailed from "./components/reviews/ReviewDetailed";
import RestaurantDetailed from "./screens/RestaurantDetailed";

function App() {
  return (
    <div className="text-center p-6 bg-red-100 dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <Router>
        <Header />
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Restaurants />} path="/restaurants" />
          <Route element={<Authentication />} path="/authentication" />
          <Route element={<ReviewDetailed />} path="/review/:id" />
          <Route element={<RestaurantDetailed />} path="/restaurant/:id" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
