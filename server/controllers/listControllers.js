import List from "../models/listModel.js";

export const getLists = async (req, res) => {
  try {
    const lists = await List.find()
      .populate("userInfo", "name email")
      .populate("restaurantIds");
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
