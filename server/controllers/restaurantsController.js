import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export const getAllRestaurants = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const reviews = await db.collection("restaurants").find({}).toArray();

    const formattedRestaurants = reviews.map((r) => ({
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
