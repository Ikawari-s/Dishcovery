import express from "express";

import {
  authUser,
  registerUser,
} from "../controllers/AuthenticationControllers.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", authUser);

export default router;
