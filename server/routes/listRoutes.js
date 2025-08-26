import express from "express";
import { getLists } from "../controllers/listControllers.js";

const router = express.Router();

router.get("/", getLists);

export default router;
