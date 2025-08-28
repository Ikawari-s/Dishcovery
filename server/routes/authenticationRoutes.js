import express from "express";
import {
  authUser,
  registerUser,
  changePassword,
} from "../controllers/authenticationControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", authUser);
router.put("/change-password", protect, changePassword);

export default router;
