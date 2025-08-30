import List from "../models/listModel.js";
import asyncHandler from "express-async-handler";

export const getAllLists = asyncHandler(async (req, res) => {
  const lists = await List.find()
    .populate("createdBy", "name profilePicture")
    .populate("restaurants.restaurantId", "name cuisine address image");
  res.json(lists);
});

export const getListById = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.id)
    .populate("createdBy", "name profilePicture")
    .populate("restaurants.restaurantId", "name cuisine address image");

  if (!list) {
    res.status(404);
    throw new Error("List not found");
  }

  res.json(list);
});

export const createList = asyncHandler(async (req, res) => {
  const { name, description, tags, isRanked, restaurants } = req.body;
  const userId = req.user._id; // assuming protect middleware sets req.user

  const list = await List.create({
    name,
    description,
    tags,
    isRanked,
    createdBy: userId,
    restaurants,
  });

  res.status(201).json(list);
});

export const deleteList = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.id);

  if (!list) {
    res.status(404);
    throw new Error("List not found");
  }

  // Only allow the creator to delete
  if (list.createdBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this list");
  }

  await list.deleteOne();

  res.json({ message: "List removed successfully" });
});
