import express from "express";
import {
  getAllMovies,
  getMovieByTitle,
} from "../controllers/moviesController.js";

const router = express.Router();

router.get("/", getAllMovies);
router.get("/:title", getMovieByTitle);

export default router;
