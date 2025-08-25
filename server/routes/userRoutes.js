import express from "express";
import {
  authUser,
  getUsers,
  registerUser,
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
router.post("/upload", upload.single("profilePicture"), uploadProfilePicture);

router.post("/", registerUser);
router.post("/login", authUser);
router.get("/get", getUsers);

export default router;
