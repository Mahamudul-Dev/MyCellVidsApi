const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "N/A",
    },
    about: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    totalVideos: {
      type: Number,
    },
    interest: [],
    purchaseList: [],
    creatorSubscriptionList: [],
    favouriteItemCount: {
      type: Number,
    },
    wishlistItemCount: {
      type: Number,
    },
    cartItemCount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema, "Users");
