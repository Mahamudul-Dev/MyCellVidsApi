const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  createdAt: {
    type: String,
  },
});

module.exports = mongoose.model("Messages", messageSchema, "Messages");
