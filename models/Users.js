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
      default: 0,
    },
    interest: [],
    purchaseList: [],
    creatorSubscriptionList: [],
    favouriteItemCount: {
      type: Number,
      default: 0,
    },
    wishlistItemCount: {
      type: Number,
      default: 0,
    },
    cartItemCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema, "Users");
