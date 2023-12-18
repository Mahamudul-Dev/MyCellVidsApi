const express = require("express");
const app = express.Router();

const productController = require("../../controllers/product.controller");
const { auth } = require("../../middleware/auth");

app.get("/", auth, productController.allProducts);
app.get("/allProducts", auth, productController.getByFiltering);
app.get("/search", auth, productController.getBySearch);
app.get("/searchByCategory", auth, productController.searchByCategory);
app.get("/:id", auth, productController.singleProduct);
app.get("/:id", auth, productController.singleProduct);
app.get("/category/:category", auth, productController.findByCategory);
app.post(
  "/",
  auth,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "downloadUrl", maxCount: 1 },
    { name: "previewUrl", maxCount: 1 },
  ]),
  productController.addProduct
);
app.post("/purchase", auth, productController.purchaseProduct);
app.post("/review/:id", auth, productController.addReview);
app.post("/action/:id", auth, productController.actionProduct);
app.put(
  "/:id",
  auth,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "downloadUrl", maxCount: 1 },
    { name: "previewUrl", maxCount: 1 },
  ]),
  productController.updateProduct
);
app.delete("/:id", auth, productController.deleteProduct);

module.exports = app;
