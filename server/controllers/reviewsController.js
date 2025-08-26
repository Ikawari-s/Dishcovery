import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";

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
    const { restaurantId, rating, comment } = req.body;

    if (!restaurantId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = mongoose.connection.db;

    // Get user info
    const user = await User.findById(req.user._id).select(
      "name profilePicture"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newReview = {
      userId: new ObjectId(req.user._id),
      restaurantId: new ObjectId(restaurantId),
      rating: Number(rating),
      comment,
      username: user.name, // ✅ add name
      userImage: user.profilePicture || "", // ✅ add profile picture (optional)
      createdAt: new Date(),
    };

    const result = await db.collection("reviews").insertOne(newReview);

    res.status(201).json({
      message: "Review added successfully",
      review: {
        ...newReview,
        _id: result.insertedId.toString(),
        userId: newReview.userId.toString(),
        restaurantId: newReview.restaurantId.toString(),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

export const getReviewsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const db = mongoose.connection.db;

    const reviews = await db
      .collection("reviews")
      .find({ userId: new ObjectId(userId) })
      .toArray();

    if (!reviews || reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this user" });
    }

    const formattedReviews = reviews.map((r) => ({
      ...r,
      _id: r._id.toString(),
      userId: r.userId.toString(),
    }));

    res.json(formattedReviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params; // reviewId

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // check if logged-in user owns the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params; // reviewId
    const { rating, comment } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // check if logged-in user owns the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    // update fields if provided
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    const updatedReview = await review.save();

    res.json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRatingStatsByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const db = mongoose.connection.db;

    const stats = await db
      .collection("reviews")
      .aggregate([
        { $match: { restaurantId: new ObjectId(restaurantId) } },
        {
          $group: {
            _id: "$rating",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: -1 }, // Sort by rating (5 → 1)
        },
      ])
      .toArray();

    const totalReviews = stats.reduce((acc, cur) => acc + cur.count, 0);

    // Build rating distribution
    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const starObj = stats.find((s) => s._id === star);
      return {
        star,
        count: starObj ? starObj.count : 0,
        percentage:
          totalReviews > 0
            ? (((starObj ? starObj.count : 0) / totalReviews) * 100).toFixed(1)
            : 0,
      };
    });

    // Compute average rating
    const avgRating =
      totalReviews > 0
        ? (
            stats.reduce((acc, cur) => acc + cur._id * cur.count, 0) /
            totalReviews
          ).toFixed(2)
        : 0;

    res.json({
      totalReviews,
      avgRating,
      distribution,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
