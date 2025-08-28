import React from "react";
import TopRestaurants from "../components/restaurants/TopRestaurants";
import UserSearch from "../components/others/UserSearch";
import RestaurantSearch from "../components/restaurants/RestaurantSearch";

function Home() {
  return (
    <div>
      Home
      <RestaurantSearch />
      <UserSearch />
      <TopRestaurants />
    </div>
  );
}

export default Home;
