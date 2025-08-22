import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Restaurants from "./screens/Restaurants";
import Authentication from "./screens/Authentication";
import Header from "./components/others/Header";

function App() {
  return (
    <div className="text-center p-6 bg-red-100 min-h-screen">
      <Router>
        <Header />
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Restaurants />} path="/restaurants" />
          <Route element={<Authentication />} path="/authentication" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
