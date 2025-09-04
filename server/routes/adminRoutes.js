import express from "express";
import Admin from "../models/adminModel.js";
import { adminLogin } from "../controllers/adminControllers.js";

const router = express.Router();

router.post("/create-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = new Admin({ name, email, password });
    await admin.save();

    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error });
  }
});

router.post("/login", adminLogin);

export default router;
