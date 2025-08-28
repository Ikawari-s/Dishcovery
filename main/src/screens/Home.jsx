import React from "react";
import HomeFood from "../components/images/homefood.jpg";
import { Link } from "react-router-dom";

function Home() {
  return (
<div>
  <div className="relative w-full h-[650px] overflow-hidden shadow-[0_60px_50px_20px_rgba(0,0,0,0.748)]">
    <img
      src={HomeFood}
      alt="Delicious food"
      className="w-[120%] h-full object-cover block"
    />

    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#111827]/100 to-transparent" />
  </div>
  
  <div className="mt-32">
    <Link
      to="/restaurants"
      className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-full shadow-md hover:bg-yellow-600 transition duration-300"
    >
      Get Started
    </Link>
  </div>
  
</div>
  );
}

export default Home;
