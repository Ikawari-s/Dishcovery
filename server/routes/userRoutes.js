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

import multer from "multer";
import path from "path";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/profilepictures");
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `profile_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

//Post
router.post("/upload", upload.single("profilePicture"), uploadProfilePicture);

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
