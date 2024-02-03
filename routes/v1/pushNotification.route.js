const express = require("express");
const app = express.Router();

const pushNotificationController = require("../../controllers/push_notification.controller");

app.get("/sendNotification", pushNotificationController.sendNotification);
app.post(
  "/sendNotificationDevice",
  pushNotificationController.sendNotificationDevice
);

module.exports = app;
