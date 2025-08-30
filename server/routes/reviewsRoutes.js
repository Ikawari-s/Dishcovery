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

router.get("/", getAllReviews); // GET all reviews
router.get("/popular", getPopularReviews);
router.get("/user/:userId", getReviewsByUserId);
router.get("/restaurant/:restaurantId", getReviewsByRestaurantId);
router.post("/add", protect, addReview);

router.get("/:id", getReviewById); // GET review by ID
router.delete("/delete/:id", protect, deleteReview);
router.put("/update/:id", protect, updateReview);
router.get("/restaurant/:restaurantId/stats", getRatingStatsByRestaurantId);
router.put("/like/:id", protect, likeReview);
router.put("/unlike/:id", protect, unlikeReview);

export default router;
