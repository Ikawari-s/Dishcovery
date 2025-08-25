import express from "express";
import {
  getAllReviews,
  getReviewById,
  addReview,
  getReviewsByRestaurantId,
  getReviewsByUserId,
} from "../controllers/reviewsController.js";

const router = express.Router();

router.get("/", getAllReviews); // GET all reviews
router.get("/user/:userId", getReviewsByUserId);
router.get("/:id", getReviewsByUserId); // GET review by ID
router.get("/restaurant/:restaurantId", getReviewsByRestaurantId);
router.post("/", addReview); // POST a new review

export default router;
