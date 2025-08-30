import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import {
  authUser,
  changePassword,
  registerUser,
  request2FA,
  updateUserName,
  verify2FA,
  forgotPasswordRequest,
  forgotPasswordVerify,
  resetPassword,
} from "../controllers/AuthenticationControllers.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/2fa/request", request2FA);
router.post("/2fa/verify", verify2FA);
router.put("/update-name", protect, updateUserName);
router.put("/change-password", protect, changePassword);
router.post("/forgot-password/request", forgotPasswordRequest);
router.post("/forgot-password/verify", forgotPasswordVerify);
router.post("/forgot-password/reset", resetPassword);

export default router;
