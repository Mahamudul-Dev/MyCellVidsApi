const express = require("express");
const app = express.Router();

const messageController = require("../../controllers/message.controller");

app.get("/", messageController.getMessages);
app.get("/allConversations", messageController.getAllConversations);

module.exports = app;
