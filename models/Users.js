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
    accountType: {
      type: String,
      default: "buyer",
    },
    accountStatus: {
      type: String,
      default: "active",
    },
    profilePic: {
      type: String,
      default: "N/A",
    },
    about: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
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
