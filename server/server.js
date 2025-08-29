import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import reviewsRoutes from "./routes/reviewsRoutes.js";
import restaurantsRoutes from "./routes/restaurantsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import authenticationRouters from "./routes/authenticationRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/authentication", authenticationRouters);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/restaurants", restaurantsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/lists", listRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
