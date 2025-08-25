import express from "express";

import { getReviewById } from "../controllers/reviewsController.js";
import {
  getAllRestaurants,
  getRestaurantById,
} from "../controllers/restaurantsController.js";

const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);

export default router;
