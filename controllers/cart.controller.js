const Carts = require("../models/Carts");
const Products = require("../models/Products");
const Users = require("../models/Users");

module.exports.allCarts = async (req, res) => {
  try {
    const userId = req.userId;
    const carts = await Carts.find({ userId: userId });

    const cartItems = carts.map((cart) => cart.items).flat();
    const cartId = carts.map((cart) => cart._id).flat();

    res.status(200).send({
      cartItems: cartItems,
      cartId: cartId[0],
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports.addItemToCart = async (req, res) => {
  try {
    const getUserId = req.userId;
    const getProductId = req.body.productId;

    const getUserDetails = await Users.findOne({ _id: getUserId });
    const cart = await Carts.findOne({ userId: getUserId });
    const product = await Products.findOne({ _id: getProductId });

    const authorDetails = await Users.findOne({ _id: product.author.authorId });
    console.log(authorDetails);

    const productDetails = {
      productId: product._id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      duration: product.duration,
      author: {
        authorId: authorDetails._id,
        name: authorDetails?.name,
        profilePic: authorDetails?.profilePic,
        country: authorDetails?.country,
        city: authorDetails?.city,
      },
    };

    if (!cart) {
      const newCart = new Carts({
        userId: getUserId,
        items: [productDetails],
      });
      await newCart.save();

      const newCartItemId = newCart._id;

      await getUserDetails.updateOne({
        $inc: { cartItemCount: 1 },
        $set: { cartItemId: newCartItemId },
      });

      res.status(200).send(newCart);
    }

    if (cart) {
      cart.items.push(productDetails);
      await cart.save();
      await getUserDetails.updateOne({ $inc: { cartItemCount: 1 } });
      res.status(200).send(cart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

module.exports.updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const cart = await Carts.findById(id);

    if (!cart) {
      return res.status(404).send("Cart not found");
    } else {
      Object.assign(cart, updateData);
      await cart.save();
      res.status(200).send(cart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

module.exports.deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    const getUserId = req.userId;

    const getUserDetails = await Users.findOne({ _id: getUserId });
    const cart = await Carts.findById(id);

    const updatedCart = cart.items.filter(
      (item) => item.productId != productId
    );

    if (!updatedCart) {
      return res
        .status(404)
        .json({ message: "Cart not found or item not found in the cart" });
    } else {
      cart.items = updatedCart;
      await cart.save();

      // Update the Users collection to decrement cartItemCount by 1
      await getUserDetails.updateOne({ $inc: { cartItemCount: -1 } });

      res.status(200).json(cart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
