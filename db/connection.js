const mongoose = require("mongoose");

const url = `mongodb://localhost:27017/MyCellVids`;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB Successfully"))
  .catch((e) => console.log("Error", e));
