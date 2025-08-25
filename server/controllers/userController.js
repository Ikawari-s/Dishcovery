import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/users
// @access  Public

const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  // Path where file is served
  const filePath = `/profilepictures/${req.file.filename}`;

  res.json({
    message: "File uploaded successfully",
    filePath,
  });
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      profilePicture: user.profilePicture,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create user
  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}); // You can use `.select("-password")` to exclude password
  res.json(users);
});

export { registerUser, authUser, getUsers, uploadProfilePicture };
