const Products = require("../models/Products");

module.exports.allProducts = async (req, res) => {
  try {
    const products = await Products.find({});

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports.singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findById(id);

    res.status(200).send(product);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports.findByCategory = async (req, res) => {
  const { category } = req.params; // Assuming you pass the categoryName in the URL

  try {
    const products = await Products.find({ mainCategory: category });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this category." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

module.exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      mainCategory,
      subCategory,
      oldPrice,
      newPrice,
      rating,
      reactions,
    } = req.body;

    if (req.file) {
      Object.assign(req.body, {
        productImg: "/uploads/images/" + req.file.filename,
      });
    }
    const newProduct = new Products({
      name: name,
      productImg: req.body.productImg,
      mainCategory: mainCategory,
      subCategory: subCategory,
      oldPrice: oldPrice,
      newPrice: newPrice,
      rating: rating,
      reactions: reactions,
    });
    await newProduct.save();

    res.status(200).send(newProduct);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      Object.assign(updateData, {
        productImg: "/uploads/images/" + req.file.filename,
      });
    }

    console.log(req.file);

    const product = await Products.findById(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    Object.assign(product, updateData);

    await product.save();

    res.status(200).send(product);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const recentProducts = await Products.find({});

    res.status(200).send(recentProducts);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
