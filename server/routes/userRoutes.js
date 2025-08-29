import express from "express";
import {
  followUser,
  getFeedReviews,
  getFollowers,
  getFollowing,
  getUsers,
  searchUsers,
  unfollowUser,
  uploadProfilePicture,
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
//Put
router.put("/follow/:id", protect, followUser);
router.put("/unfollow/:id", protect, unfollowUser);

router.post(
  "/upload-profile-picture",
  protect,
  upload.single("image"),
  uploadProfilePicture
);

export default router;
