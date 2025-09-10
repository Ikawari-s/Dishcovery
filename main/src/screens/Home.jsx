import React, { useEffect, useState } from "react";
import HomeFood from "../components/images/homefood.jpg";
import { Link } from "react-router-dom";
import PopularReviews from "../components/reviews/PopularReviews";
const foodEmojis = ["🍕", "🍔", "🍣", "🍩", "🍉", "🌮", "🍦", "🥗", "🍜", "🍰"];
const features = [
  {
    title: "Discover New Restaurants",
    description:
      "Explore trending spots, hidden gems, and recommendations from the community",
  },
  {
    title: "Like Dishes",
    description:
      "Show love for your favorite dishes, cuisines, or chef specials",
  },
  {
    title: "Write Reviews",
    description:
      "Share your experience, taste notes, and follow fellow foodies",
  },
  {
    title: "Rate Everything",
    description:
      "Give meals a star rating (yes, halves allowed!) to document your taste",
  },
  {
    title: "Follow your Favorite Reviewers",
    description:
      "Stay in the loop with people who match your tastes and discover new favorites",
  },
  {
    title: "Create Food Lists",
    description: "Make your personal list or keep a 'Must-Try' queue",
  },
];

function Home() {
  const [emoji, setEmoji] = useState(foodEmojis[0]);
  const [positionX, setPositionX] = useState(50);
  const [visible, setVisible] = useState(false);
  const [showInitial, setShowInitial] = useState(false);

  const getRandomEmoji = (exclude) => {
    const filtered = foodEmojis.filter((e) => e !== exclude);
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const getRandomPosition = () => Math.random() * 90 + 5;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitial(true);
      setEmoji(getRandomEmoji(null));
      setPositionX(getRandomPosition());
      setVisible(true);
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  const handleHover = () => {
    setVisible(false);

    setTimeout(() => {
      setEmoji((prev) => getRandomEmoji(prev));
      setPositionX(getRandomPosition());
      setVisible(true);
    }, 20000);
  };

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
      <div className="mt-32 mb-10 text-center">
        <Link
          to="/restaurants"
          className="px-8 py-3 bg-yellow-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-yellow-600 transition duration-300"
        >
          Hungry?
        </Link>
      </div>
      <div className="w-[80vw] mb-6 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {features.map((feature, index) => (
          <div
            key={index}
            className="shadow-lg bg-yellow-50 dark:bg-gray-800 rounded-md p-6 transition-all duration-300 hover:bg-yellow-100 hover:dark:bg-gray-700 hover:-translate-y-1"
          >
            <div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-900 dark:text-white">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4">
        <PopularReviews />
      </div>
      <div className="relative w-full h-24">
        <span
          className={`text-2xl sm:text-4xl md:text-6xl ca_fx-vibration ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            position: "absolute",
            bottom: "10px",
            left: `${positionX}%`,
            userSelect: "none",
            transformOrigin: "center",
            transform: "translateX(-50%)",
          }}
          onMouseEnter={handleHover}
        >
          {emoji}
        </span>
      </div>
    </div>
  );
}

export default Home;
