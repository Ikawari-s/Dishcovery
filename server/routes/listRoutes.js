import express from "express";
import { getAllLists, getListById } from "../controllers/listControllers.js";

const router = express.Router();

router.get("/", getAllLists);
router.get("/:id", getListById);

export default router;
