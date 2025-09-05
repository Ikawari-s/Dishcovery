import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import generateToken from "../utils/generateToken.js"; // reuse your token generator
import Review from "../models/reviewModel.js";

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      permissions: admin.permissions,
      token: generateToken(admin._id), // ✅ admin token
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const adminDeleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    await review.deleteOne();

    res.json({ message: "Review deleted successfully by admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
