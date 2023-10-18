const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");

// There are the code of file upload
global.upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      fs.mkdirSync("public/uploads/images", { recursive: true });
      cb(null, "public/uploads/images");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
});

// Connect DB
require("./db/connection");

// app Use
const app = express();

app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use((req, res, next) => {
  console.log("HTTP Method - " + req.method + " URL - " + req.url);
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const adminRoutes = require("./routes/v1/admin.route");
const userRoutes = require("./routes/v1/user.route");
const productRoutes = require("./routes/v1/product.route");

const port = 5656;

// All Routes will be here
app.get("/", (req, res) => {
  res.send("Welcome to NetflixBuy");
});

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);

app.listen(port, () => {
  console.log("listening on port " + port);
});
