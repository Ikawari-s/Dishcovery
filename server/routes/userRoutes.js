import express from "express";
import {
  followUser,
  getFeedReviews,
  getFollowers,
  getFollowing,
  getUserProfile,
  getUsers,
  getUserStats,
  searchUsers,
  unfollowUser,
  uploadProfilePicture,
  updateProfile,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

//Get

router.get("/get", getUsers);
router.get("/followers/:id", getFollowers);
router.get("/following/:id", getFollowing);
router.get("/search", searchUsers);
router.get("/feed", protect, getFeedReviews);
router.get("/stats", getUserStats);
router.get("/:id", getUserProfile);
//Put
router.put("/follow/:id", protect, followUser);
router.put("/unfollow/:id", protect, unfollowUser);
router.put("/update-profile", protect, updateProfile);
router.post(
  "/upload-profile-picture",
  protect,
  upload.single("image"),
  uploadProfilePicture
);

export default router;
