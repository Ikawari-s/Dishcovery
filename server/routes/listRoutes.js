import express from "express";
import {
  createList,
  getAllLists,
  getListById,
} from "../controllers/listControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllLists);
router.post("/create", protect, createList);
router.get("/:id", getListById);

export default router;
