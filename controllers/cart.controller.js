const Carts = require("../models/Carts");
const Products = require("../models/Products");
const Users = require("../models/Users");


module.exports.allCarts = async (req, res) => {
    try {
        const userId = req.userId;
        const carts = await Carts.find({ userId: userId });
        const cartItems = carts.map((cart) => cart.items).flat();
        res.status(200).send(cartItems);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
}

module.exports.addItemToCart = async (req, res) => {
    try {
        const getUserId = req.userId;
        const getProductId = req.body.productId;

        const getUserDetails = await Users.findOne({ _id: getUserId });
        const cart = await Carts.findOne({ userId: getUserId });
        const product = await Products.findOne({ _id: getProductId });

        const authorDetails = await Users.findOne({ _id: product.author });
        console.log(authorDetails)


        const productDetails = {
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            author: {
                name: authorDetails?.name,
                profilePic: authorDetails?.profilePic,
                country: authorDetails?.country,
                city: authorDetails?.city
            },
        }

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