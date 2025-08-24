import express from "express";
import {
  getAllReviews,
  getReviewById,
  addReview,
} from "../controllers/reviewsController.js";

const router = express.Router();

router.get("/", getAllReviews); // GET all reviews
router.get("/:id", getReviewById); // GET review by ID
router.post("/", addReview); // POST a new review

export default router;
