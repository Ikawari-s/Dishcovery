import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import Restaurant from "../models/restaurantModel.js";

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

    const review = new Review({
      userId: req.user._id,
      restaurantId,
      rating,
      comment,
    });

    const savedReview = await review.save();
    const populatedReview = await savedReview.populate(
      "userId",
      "name profilePicture"
    );

    // ✅ Update average rating
    await updateRestaurantRating(restaurantId);

    res.status(201).json({
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    const updatedReview = await review.save();

    // ✅ Update average rating
    await updateRestaurantRating(review.restaurantId);

    res.json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateRestaurantRating = async (restaurantId) => {
  const reviews = await Review.find({ restaurantId });
  if (!reviews.length) {
    await Restaurant.findByIdAndUpdate(restaurantId, { rating: 0 });
    return;
  }

  const avgRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  await Restaurant.findByIdAndUpdate(restaurantId, { rating: avgRating });
};

export const getReviewsByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const reviews = await Review.find({ restaurantId }).populate(
      "userId",
      "name profilePicture"
    );

    if (!reviews || reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this restaurant" });
    }

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReviewsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ userId }).populate(
      "userId",
      "name profilePicture"
    );

    if (!reviews || reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this user" });
    }

    res.json(reviews);
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

export const likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if already liked
    if (review.likes.includes(req.user._id)) {
      return res.status(400).json({ message: "Already liked" });
    }

    review.likes.push(req.user._id);
    await review.save();

    res.json({
      message: "Review liked",
      likesCount: review.likes.length,
      likers: review.likes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unlike a review
export const unlikeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user has liked
    if (!review.likes.includes(req.user._id)) {
      return res.status(400).json({ message: "You haven't liked this review" });
    }

    review.likes = review.likes.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );
    await review.save();

    res.json({
      message: "Review unliked",
      likesCount: review.likes.length,
      likers: review.likes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPopularReviews = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const popularReviews = await Review.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    })
      .populate("userId", "name profilePicture")
      .populate("restaurantId", "name")
      .lean();

    const sortedReviews = popularReviews.sort(
      (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
    );

    res.json(sortedReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
