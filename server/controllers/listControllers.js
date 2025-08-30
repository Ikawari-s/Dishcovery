import List from "../models/listModel.js";
import asyncHandler from "express-async-handler";

export const getAllLists = asyncHandler(async (req, res) => {
  const lists = await List.find()
    .populate("createdBy", "name profilePicture")
    .populate("restaurants.restaurantId", "name cuisine address image");
  res.json(lists);
});

// @desc    Get list by ID
// @route   GET /api/lists/:id
// @access  Public
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
