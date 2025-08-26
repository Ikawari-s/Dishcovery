import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

export const uploadProfilePicture = asyncHandler(async (req, res) => {
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

export const authUser = asyncHandler(async (req, res) => {
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

export const registerUser = asyncHandler(async (req, res) => {
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

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}); // You can use `.select("-password")` to exclude password
  res.json(users);
});

export const followUser = asyncHandler(async (req, res) => {
  const userId = req.user._id; // logged-in user
  const targetId = req.params.id; // user to follow

  if (userId.toString() === targetId) {
    res.status(400);
    throw new Error("You cannot follow yourself");
  }

  const user = await User.findById(userId);
  const targetUser = await User.findById(targetId);

  if (!targetUser) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.following.includes(targetId)) {
    user.following.push(targetId);
    targetUser.followers.push(userId);
    await user.save();
    await targetUser.save();
    res.json({ message: `You are now following ${targetUser.name}` });
  } else {
    res.status(400);
    throw new Error("Already following this user");
  }
});

// Unfollow a user
export const unfollowUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const targetId = req.params.id;

  const user = await User.findById(userId);
  const targetUser = await User.findById(targetId);

  if (!targetUser) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.following.includes(targetId)) {
    user.following = user.following.filter((id) => id.toString() !== targetId);
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== userId.toString()
    );
    await user.save();
    await targetUser.save();
    res.json({ message: `You have unfollowed ${targetUser.name}` });
  } else {
    res.status(400);
    throw new Error("You are not following this user");
  }
});

export const getFollowers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate(
    "followers",
    "name email profilePicture"
  );
  res.json(user.followers);
});

export const getFollowing = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate(
    "following",
    "name email profilePicture"
  );
  res.json(user.following);
});
