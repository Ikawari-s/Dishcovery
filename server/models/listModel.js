import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    tags: [String],
    isRanked: {
      type: Boolean,
      default: false,
    },
    // Reference the user who created the list
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Restaurants in the list
    restaurants: [
      {
        restaurantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Restaurant",
          required: true,
        },
        notes: { type: String, default: "" },
        rank: { type: Number, default: null }, // can be null if not ranked
      },
    ],
  },
  { timestamps: true }
);

const List = mongoose.model("List", listSchema);
export default List;
