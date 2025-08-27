import React from "react";
import TopRestaurants from "../components/restaurants/TopRestaurants";
import UserSearch from "../components/others/UserSearch";

function Home() {
  return (
    <div>
      Home
      <UserSearch />
      <TopRestaurants />
    </div>
  );
}

export default Home;
