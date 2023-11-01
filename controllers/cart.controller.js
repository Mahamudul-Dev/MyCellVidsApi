const Carts = require("../models/Carts");
const Products = require("../models/Products");

module.exports.addItemToCart = async (req, res) => {
    try {
        const getUserId = req.userId;
        const getProductId = req.body.productId;

        const cart = await Carts.findOne({ userId: getUserId });
        const product = await Products.findOne({ _id: getProductId });
        console.log(product)

        const productDetails = {
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            author: product.author,
        }

        if (!cart) {
            const newCart = new Carts({
                userId: getUserId,
                items: [productDetails],
            })
            await newCart.save();
        }

        if (cart) {
            cart.items.push({
                items: [productDetails],
            });
            await cart.save();
            res.status(200).send(cart);
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}