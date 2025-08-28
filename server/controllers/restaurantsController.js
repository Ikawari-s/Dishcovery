import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import Restaurant from "../models/restaurantModel.js";
import asyncHandler from "express-async-handler";

export const getAllRestaurants = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const restaurants = await db.collection("restaurants").find({}).toArray();

    const formattedRestaurants = restaurants.map((r) => ({
      ...r,
      _id: r._id.toString(),
    }));

    res.json(formattedRestaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single review by ID
export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = mongoose.connection.db;
    const restaurant = await db
      .collection("restaurants")
      .findOne({ _id: new ObjectId(id) });
    if (!res) return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const searchRestaurants = asyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) {
    res.status(400);
    throw new Error("Search query is required");
  }

  // Case-insensitive, partial match on restaurant name
  const restaurants = await Restaurant.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { cuisine: { $regex: query, $options: "i" } },
      { tags: { $regex: query, $options: "i" } },
    ],
  });

  res.json(restaurants);
});
