const Favourite = require("../models/Favourite");
const Products = require("../models/Products");
const Users = require("../models/Users");

module.exports.allFavouriteItem = async (req, res) => {
  try {
    const userId = req.userId;
    const favourites = await Favourite.find({ userId: userId });

    const favouriteItems = favourites
      .map((favourite) => favourite.items)
      .flat();
    const favouriteId = favourites.map((favourite) => favourite._id).flat();

    res.status(200).send({
      favouriteItems: favouriteItems,
      favouriteId: favouriteId[0],
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports.addItemToFavourite = async (req, res) => {
  try {
    const getUserId = req.userId;
    const getProductId = req.body.productId;

    const getUserDetails = await Users.findOne({ _id: getUserId });
    console.log(getUserDetails);
    const favourite = await Favourite.findOne({ userId: getUserId });
    const product = await Products.findOne({ _id: getProductId });

    const authorDetails = await Users.findOne({ _id: product.author.authorId });

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

    if (!favourite) {
      const newFavourite = new Favourite({
        userId: getUserId,
        items: [productDetails],
      });
      await newFavourite.save();

      const newFavouriteItemId = newFavourite._id;

      await getUserDetails.updateOne({
        $inc: { favouriteItemCount: 1 },
        $set: { favouriteItemId: newFavouriteItemId },
      });
      res.status(200).send(newFavourite);
    }

    if (favourite) {
      favourite.items.push(productDetails);
      await favourite.save();
      await getUserDetails.updateOne({ $inc: { favouriteItemCount: 1 } });
      res.status(200).send(favourite);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

module.exports.updateFavouriteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const favourite = await Favourite.findById(id);

    if (!favourite) {
      return res.status(404).send("favourite not found");
    } else {
      Object.assign(favourite, updateData);
      await favourite.save();
      res.status(200).send(favourite);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

module.exports.deleteFavouriteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    const getUserId = req.userId;

    const getUserDetails = await Users.findOne({ _id: getUserId });
    const favourite = await Favourite.findById(id);
    console.log(favourite);

    const updatedFavourite = favourite.items.filter(
      (item) => item.productId != productId
    );

    if (!updatedFavourite) {
      return res.status(404).json({
        message: "favourite not found or item not found in the favourite",
      });
    } else {
      favourite.items = updatedFavourite;
      await favourite.save();

      // Update the Users collection to decrement favouriteItemCount by 1
      await getUserDetails.updateOne({ $inc: { favouriteItemCount: -1 } });

      res.status(200).json(favourite);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
