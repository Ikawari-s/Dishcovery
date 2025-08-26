import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    listName: { type: String, required: true },
    listDetails: { type: String, required: true },
    restaurantIds: [
      {
        restaurantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Restaurant",
          required: true,
        },
      },
    ],
    isRanked: {
      type: Boolean,
      default: false, // default false unless explicitly ranked
    },
    userInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const List = mongoose.model("List", listSchema);

export default List;
