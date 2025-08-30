import express from "express";
import { getAllLists } from "../controllers/listControllers.js";

const router = express.Router();

router.get("/", getAllLists);

export default router;
