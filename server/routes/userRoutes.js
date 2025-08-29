import express from "express";
import {
  followUser,
  getFeedReviews,
  getFollowers,
  getFollowing,
  getUsers,
  searchUsers,
  unfollowUser,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//Get
router.get("/get", getUsers);
router.get("/followers/:id", getFollowers);
router.get("/following/:id", getFollowing);
router.get("/search", searchUsers);
router.get("/feed", protect, getFeedReviews);
//Put
router.put("/follow/:id", protect, followUser);
router.put("/unfollow/:id", protect, unfollowUser);

export default router;
