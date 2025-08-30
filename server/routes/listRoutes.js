import express from "express";
import {
  createList,
  deleteList,
  getAllLists,
  getListById,
} from "../controllers/listControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllLists);
router.post("/create", protect, createList);
router.route("/:id").get(getListById).delete(protect, deleteList);

export default router;
