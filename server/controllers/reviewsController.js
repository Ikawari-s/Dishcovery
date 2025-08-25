import mongoose from "mongoose";
import { ObjectId } from "mongodb";

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const reviews = await db.collection("reviews").find({}).toArray();

    const formattedReviews = reviews.map((r) => ({
      ...r,
      _id: r._id.toString(),
    }));

    res.json(formattedReviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single review by ID
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = mongoose.connection.db;
    const review = await db
      .collection("reviews")
      .findOne({ _id: new ObjectId(id) });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new review
export const addReview = async (req, res) => {
  try {
    const { username, rating, comment } = req.body;
    if (!username || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = mongoose.connection.db;
    const newReview = {
      username,
      rating: rating.toString(),
      comment,
      createdAt: new Date(),
    };
    const result = await db.collection("reviews").insertOne(newReview);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get reviews for a specific restaurant
export const getReviewsByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const db = mongoose.connection.db;

    const reviews = await db
      .collection("reviews")
      .find({ restaurantId: new ObjectId(restaurantId) })
      .toArray();

    if (!reviews || reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this restaurant" });
    }

    const formattedReviews = reviews.map((r) => ({
      ...r,
      _id: r._id.toString(),
      restaurantId: r.restaurantId.toString(),
    }));

    res.json(formattedReviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
