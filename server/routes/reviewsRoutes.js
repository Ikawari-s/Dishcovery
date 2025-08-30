import express from "express";
import {
  getAllReviews,
  getReviewById,
  addReview,
  getReviewsByRestaurantId,
  getReviewsByUserId,
  deleteReview,
  updateReview,
  getRatingStatsByRestaurantId,
  likeReview,
  unlikeReview,
  getPopularReviews,
} from "../controllers/reviewsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//1. Collection routes
router.get("/", getAllReviews);
router.get("/popular", getPopularReviews);

//2. Routes grouped by restaurant
router.get("/restaurant/:restaurantId", getReviewsByRestaurantId);
router.get("/restaurant/:restaurantId/stats", getRatingStatsByRestaurantId);

//3. Routes grouped by user
router.get("/user/:userId", getReviewsByUserId);

// 4. Actions (crud)
router.post("/add", protect, addReview);
router.put("/update/:id", protect, updateReview);
router.delete("/delete/:id", protect, deleteReview);
router.put("/like/:id", protect, likeReview);
router.put("/unlike/:id", protect, unlikeReview);

// 5. Single ID
router.get("/:id", getReviewById);
export default router;
