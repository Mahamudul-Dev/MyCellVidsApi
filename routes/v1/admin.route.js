const express = require("express");
const app = express.Router();

const adminController = require("../../controllers/admin.controller");
const { auth } = require("../../middleware/auth");

app.get("/", auth, adminController.getAdmin);
app.post("/register", adminController.createAdmin);
app.post("/login", adminController.adminLogin);
app.put("/:adminId", auth, adminController.updatedAdmin);

module.exports = app;
