const Products = require("../models/Products");
const Users = require("../models/Users");

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
  if (filter === "totalSalesHighToLow") {
    sortOption.totalSales = -1;
  } else if (filter === "totalSalesLowToHigh") {
    sortOption.totalSales = 1;
  } else if (filter === "ratingHighToLow") {
    sortOption.ratings = -1;
  } else if (filter === "ratingLowToHigh") {
    sortOption.ratings = 1;
  } else if (filter === "priceHighToLow") {
    sortOption.price = -1;
  } else if (filter === "priceLowToHigh") {
    sortOption.price = 1;
  }

  try {
    const products = await Products.find().sort(sortOption).exec();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

module.exports.getBySearch = async (req, res) => {
  try {
    const { searchItem } = req.query; // Get the search query from the URL query parameter

    if (!searchItem) {
      // If no search query provided, return an empty result or an error message
      return res.json([]);
    }

    try {
      // Use the Product model to find products by title
      if (searchItem.startsWith("@")) {
        const authorName = searchItem.substring(1); // Remove "@" from the beginning
        authorQuery = {
          "author.name": { $regex: new RegExp(authorName, "i") },
        };
        const foundProducts = await Products.find(authorQuery);
        res.json({
          message: "Data fetched successfully",
          query: authorQuery,
          result: foundProducts,
        });
      } else {
        const foundProducts = await Products.find({
          $or: [
            { title: { $regex: new RegExp(searchItem, "i") } }, // Case-insensitive search by title
            { description: { $regex: new RegExp(searchItem, "i") } }, // Case-insensitive search by description
          ],
        });
        res.json({
          message: "Data fetched successfully",
          query: searchItem,
          result: foundProducts,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while searching for products." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
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
        category: { $regex: new RegExp(searchByCategory, "i") }, // Case-insensitive search by title
      });

      res.json(foundProducts);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while searching for products." });
    }
  } catch (error) {
    console.log(error);
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
      return res.status(404).send("No products found for this category.");
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports.addProduct = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).send("Unauthorized");
    }

    // Increment the totalVideos field of the user
    const recentUser = await Users.findByIdAndUpdate(userId, {
      $inc: { totalVideos: 1 },
    });

    if (!recentUser) {
      return res.status(404).send("User not found");
    }

    const author = {
      authorId: recentUser._id,
      name: recentUser.name,
      country: recentUser.country,
      city: recentUser.city,
      totalVideos: recentUser.totalVideos + 1,
      profilePic: recentUser.profilePic,
    };

    // Check if files were uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    // Get the filenames of the uploaded files
    const thumbnail = req.files["thumbnail"][0].filename;
    const downloadUrl = req.files["downloadUrl"][0].filename;
    const previewUrl = req.files["previewUrl"][0].filename;

    // Create a new product
    req.body.thumbnail = "/uploads/thumbnail/" + thumbnail;
    req.body.downloadUrl = "/uploads/downloadUrl/" + downloadUrl;
    req.body.previewUrl = "/uploads/previewUrl/" + previewUrl;
    req.body.author = author;

    const newProduct = new Products(req.body);
    await newProduct.save();

    res.status(200).send(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

module.exports.purchaseProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const product = await Products.findOne({ _id: productId });
    const authorDetails = await Users.findOne({ _id: product.author.authorId });
    console.log(authorDetails);

    const productDetails = {
      productId: product._id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      duration: product.duration,
      totalSales: product.totalSales,
      author: {
        authorId: authorDetails._id,
        name: authorDetails?.name,
        profilePic: authorDetails?.profilePic,
        country: authorDetails?.country,
        city: authorDetails?.city,
      },
    };

    const updatedUser = await Users.findByIdAndUpdate(userId, {
      $push: { purchaseList: productDetails },
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    const recentUserDetails = await Users.findById(userId);

    res.status(200).send(recentUserDetails);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    try {
      if (req.files["thumbnail"]) {
        updateData.thumbnail =
          "/uploads/thumbnail/" + req.files["thumbnail"][0].filename;
      } else if (req.files["downloadUrl"]) {
        updateData.downloadUrl =
          "/uploads/downloadUrl/" + req.files["downloadUrl"][0].filename;
      } else if (req.files["previewUrl"]) {
        updateData.previewUrl =
          "/uploads/previewUrl/" + req.files["previewUrl"][0].filename;
      }

      const product = await Products.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!product) {
        return res.status(404).send("Product not found");
      }

      const recentProducts = await Products.find({});
      res.status(200).send(recentProducts);
    } catch (error) {
      const product = await Products.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!product) {
        return res.status(404).send("Product not found");
      }

      const recentProducts = await Products.find({});
      res.status(200).send(recentProducts);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

module.exports.addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    const userId = req.userId; // Assuming you have user authentication middleware

    // Validate input
    if (!id || !rating || !userId) {
      return res.status(400).json({ message: "Invalid input data." });
    }

    // Check if the product exists
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check if the user exists
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Add the new review to the reviews array
    product.reviews.push({
      user: userId,
      rating,
      review,
    });

    // Update the product with the new review and average rating
    const ratingSum = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    product.ratings = Math.round(ratingSum / product.reviews.length);

    // Save the updated product
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

module.exports.actionProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { videoStatus, reason } = req.body;

    const product = await Products.findById(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    product.videoStatus = videoStatus;

    if (reason) {
      product.videoStrike.push({ reason });
    } else {
      product.videoStrike = [];
    }

    await product.save();

    const recentProducts = await Products.find({});

    res.status(200).send(recentProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const product = await Products.findByIdAndDelete(id);

    const user = await Users.findById(userId);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const recentProducts = await Products.find({});
    const recentUser = await Users.findByIdAndUpdate(userId, {
      $set: { totalVideos: user.totalVideos - 1 },
    });

    res.status(200).send(recentProducts);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
