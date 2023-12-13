const express = require("express");
const app = express.Router();

const messageController = require("../../controllers/message.controller");
const { auth } = require("../../middleware/auth");

app.get("/", auth, messageController.getMessages);
app.get("/allConversations", auth, messageController.getAllConversations);

module.exports = app;
