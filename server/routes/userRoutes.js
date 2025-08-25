import express from "express";
import {
  authUser,
  getUsers,
  registerUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", authUser);
router.get("/get", getUsers);
export default router;
