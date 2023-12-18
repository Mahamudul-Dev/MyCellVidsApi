const express = require("express");
const app = express.Router();

const userControllers = require("../../controllers/user.controller");
const { auth } = require("../../middleware/auth");

app.get("/", auth, userControllers.allUsers);
app.get("/:id", auth, userControllers.singleUser);
app.post("/userNameExist", auth, userControllers.userNameExist);
app.post("/register", userControllers.register);
app.post("/login", userControllers.login);
app.post("/addUser", auth, userControllers.addUser);
app.post("/getMultipleProfile", auth, userControllers.getMultipleProfile);
app.put("/subscription", auth, userControllers.subscription);
app.put("/userNameUpdate/:id", auth, userControllers.userNameUpdate);
app.put(
  "/update/:id",
  auth,
  upload.single("profilePic"),
  userControllers.updateUser
);
app.delete("/:id", auth, userControllers.deleteUser);

module.exports = app;
