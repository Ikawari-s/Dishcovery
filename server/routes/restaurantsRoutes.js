import express from "express";

import {
  getAllRestaurants,
  getRestaurantById,
} from "../controllers/restaurantsController.js";

const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);

export default router;
