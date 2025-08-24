import mongoose from "mongoose";

export const getAllMovies = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const movies = await db.collection("movies").find({}).limit(50).toArray();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMovieByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const db = mongoose.connection.db;
    const movie = await db.collection("movies").findOne({ title });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
