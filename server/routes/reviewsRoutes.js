import express from "express";
import {
  getAllReviews,
  getReviewById,
  addReview,
  getReviewsByRestaurantId,
  getReviewsByUserId,
} from "../controllers/reviewsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllReviews); // GET all reviews
router.get("/user/:userId", getReviewsByUserId);
router.get("/:id", getReviewById); // GET review by ID
router.get("/restaurant/:restaurantId", getReviewsByRestaurantId);
router.post("/add", protect, addReview);

export default router;
