const Carts = require("../models/Carts");
const Products = require("../models/Products");
const Users = require("../models/Users");

module.exports.addItemToCart = async (req, res) => {
    try {
        const getUserId = req.userId;
        const getProductId = req.body.productId;

        const getUserDetails = await Users.findOne({ _id: getUserId });
        const cart = await Carts.findOne({ userId: getUserId });
        const product = await Products.findOne({ _id: getProductId });


        const productDetails = {
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            author: product.author,
        }

        console.log(productDetails)

        if (!cart) {
            const newCart = new Carts({
                userId: getUserId,
                items: [productDetails],
            })
            await newCart.save();
            await getUserDetails.updateOne({ $inc: { cartItemCount: 1 } })
            res.status(200).send(newCart);
        }

        if (cart) {
            cart.items.push(productDetails);
            await cart.save();
            await getUserDetails.updateOne({ $inc: { cartItemCount: 1 } })
            res.status(200).send(cart);
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}