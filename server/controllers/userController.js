import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import Review from "../models/reviewModel.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}); // You can use `.select("-password")` to exclude password
  res.json(users);
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id; // get user id from route params

  const user = await User.findById(userId).select(
    "-password -followers -following"
  ); // exclude password, followers, and following

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    _id: user._id,
    name: user.name,
    givenName: user.givenName,
    familyName: user.familyName,
    email: user.email,
    profilePicture: user.profilePicture,
    location: user.location,
    website: user.website,
    bio: user.bio,
    createdAt: user.createdAt,
  });
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

export const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query; // ?query=someName

  if (!query) {
    res.status(400);
    throw new Error("Search query is required");
  }

  // Use regex for partial & case-insensitive match
  const users = await User.find({
    name: { $regex: query, $options: "i" },
  }).select("-password"); // exclude password

  res.json(users);
});

export const getFeedReviews = asyncHandler(async (req, res) => {
  try {
    // Logged-in user
    const userId = req.user._id;

    // Find the user's following list
    const user = await User.findById(userId).select("following");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.following || user.following.length === 0) {
      return res.json([]); // No following → no feed
    }

    // Fetch reviews from followed users
    const reviews = await Review.find({
      userId: { $in: user.following },
    })
      .populate("userId", "name profilePicture") // attach name & profilePicture
      .sort({ createdAt: -1 }); // newest first

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No image uploaded");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Save profile picture as a full static URL
  const imageUrl = `/public/images/${req.file.filename}`;
  user.profilePicture = imageUrl;
  await user.save();

  res.json({
    message: "Profile picture updated successfully",
    imageUrl: imageUrl, // frontend can fetch directly
  });
});

//get number of reviews, followers, following
export const getUserStats = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const reviewCount = await Review.countDocuments({ userId: userId });

  const followersCount = user.followers.length;
  const followingCount = user.following.length;

  res.json({
    reviews: reviewCount,
    followers: followersCount,
    following: followingCount,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { givenName, familyName, location, website, bio } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update only allowed fields
  user.givenName = givenName ?? user.givenName;
  user.familyName = familyName ?? user.familyName;
  user.location = location ?? user.location;
  user.website = website ?? user.website;
  user.bio = bio ?? user.bio;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    givenName: updatedUser.givenName,
    familyName: updatedUser.familyName,
    location: updatedUser.location,
    website: updatedUser.website,
    bio: updatedUser.bio,
    email: updatedUser.email,
    profilePicture: updatedUser.profilePicture,
    createdAt: updatedUser.createdAt,
  });
});

export const getUserFavorites = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).populate({
    path: "favorites",
    model: "Restaurant",
    select: "name cuisine image",
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // map _id -> restaurantId
  const favorites = user.favorites.map((rest) => ({
    restaurantId: rest._id, // rename field
    name: rest.name,
    cuisine: rest.cuisine,
    image: rest.image,
  }));

  res.status(200).json({ favorites });
});
