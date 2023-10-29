const Products = require("../models/Products");

module.exports.allProducts = async (req, res) => {
  try {
    const products = await Products.find({});

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports.getByFiltering = async (req, res) => {
  const { filter } = req.query;
  const sortOption = {};

  // Determine the sorting criteria based on the "filter" query parameter
  if (filter === 'totalSalesHighToLow') {
    sortOption.totalSales = -1;
  } else if (filter === 'totalSalesLowToHigh') {
    sortOption.totalSales = 1;
  } else if (filter === 'ratingHighToLow') {
    sortOption.ratings = -1;
  } else if (filter === 'ratingLowToHigh') {
    sortOption.ratings = 1;
  } else if (filter === 'priceHighToLow') {
    sortOption.price = -1;
  } else if (filter === 'priceLowToHigh') {
    sortOption.price = 1;
  }

  try {
    const products = await Products.find().sort(sortOption).exec();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}

module.exports.getBySearch = async (req, res) => {
  try {
    const { searchItem } = req.query; // Get the search query from the URL query parameter

    if (!searchItem) {
      // If no search query provided, return an empty result or an error message
      return res.json([]);
    }

    try {
      // Use the Product model to find products by title
      const foundProducts = await Products.find({
        title: { $regex: new RegExp(searchItem, 'i') }, // Case-insensitive search by title
      });

      res.json(foundProducts);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while searching for products.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
};

module.exports.searchByCategory = async (req, res) => {
  try {
    const { searchByCategory } = req.query; // Get the search query from the URL query parameter

    if (!searchByCategory) {
      // If no search query provided, return an empty result or an error message
      return res.json([]);
    }

    try {
      // Use the Product model to find products by title
      const foundProducts = await Products.find({
        category: { $regex: new RegExp(searchByCategory, 'i') }, // Case-insensitive search by title
      });

      res.json(foundProducts);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while searching for products.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
}

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
        .send("No products found for this category.");
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports.addProduct = async (req, res) => {
  try {

    if (req.file) {
      Object.assign(req.body, {
        productImg: "/uploads/images/" + req.file.filename,
      });
    }
    const newProduct = new Products(req.body);
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


