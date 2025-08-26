import React, { useEffect, useState } from "react";
import "./LoadingScreen.css";

const emojis = ["🍗", "🍕", "🍔", "🍣", "🍩", "🌮", "🍦", "🍉", "🍪"];

const LoadingScreen = ({ onFinish }) => {
  const [animateOut, setAnimateOut] = useState(false);
  const [emoji, setEmoji] = useState("🍗");

  useEffect(() => {

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setEmoji(randomEmoji);

    const startTimeout = setTimeout(() => {
      setAnimateOut(true);
      const endTimeout = setTimeout(() => {
        onFinish();
      }, 600); 

      return () => clearTimeout(endTimeout);
    }, 1000);

    return () => clearTimeout(startTimeout);
  }, [onFinish]);

  return (
    <div className={`loading-screen ${animateOut ? "swipe-up" : ""}`}>
      <div className="animate-spin text-8xl">{emoji}</div>
    </div>
  );
};

export default LoadingScreen;
