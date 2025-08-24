import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import moviesRoutes from "./routes/movieRoutes.js";
import reviewsRoutes from "./routes/reviewsRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/movies", moviesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
