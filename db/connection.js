const mongoose = require("mongoose");

const url = `mongodb+srv://mahamuduldev:0308412@my-cell-vids-db.8pf3ybb.mongodb.net/?retryWrites=true&w=majority`;
// const url = "mongodb://localhost:27017";

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB Successfully"))
  .catch((e) => console.log("Error", e));
