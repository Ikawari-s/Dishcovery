import React from "react";
import HomeFood from "../components/images/homefood.jpg";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div className="relative w-full h-[92vh] overflow-hidden shadow-[0_60px_50px_20px_rgba(0,0,0,0.748)]">
        <img
          src={HomeFood}
          alt="Delicious food"
          className="w-full h-full object-cover block"
        />

        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#f3f1de] to-transparent dark:from-[#101725]/100" />


        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center px-6">
          <h1 className="text-gray-900 dark:text-white text-5xl md:text-8xl font-bebas drop-shadow-lg">
            "Food is our common ground, a universal experience."
          </h1>
        </div>
      </div>

      <div className="mt-32 text-center">
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
