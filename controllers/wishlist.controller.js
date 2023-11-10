const Products = require("../models/Products");
const Users = require("../models/Users");
const Wishlist = require("../models/Wishlist");


module.exports.allWishlistItem = async (req, res) => {
    try {
        const userId = req.userId;
        const wishlists = await Wishlist.find({ userId: userId });

        const wishlistItems = wishlists.map((wishlist) => wishlist.items).flat();
        const wishlistId = wishlists.map((wishlist) => wishlist._id).flat();

        res.status(200).send({
            wishlistItems: wishlistItems,
            wishlistId: wishlistId[0]
        });
    } catch (error) {
        res.status(500).send("Internal server error");
    }
}

module.exports.addItemToWishlist = async (req, res) => {
    try {
        const getUserId = req.userId;
        const getProductId = req.body.productId;

        const getUserDetails = await Users.findOne({ _id: getUserId });
        const wishlist = await Wishlist.findOne({ userId: getUserId });
        const product = await Products.findOne({ _id: getProductId });

        const authorDetails = await Users.findOne({ _id: product.author });
        console.log(authorDetails)


        const productDetails = {
            productId: product._id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            duration: product.duration,
            author: {
                name: authorDetails?.name,
                profilePic: authorDetails?.profilePic,
                country: authorDetails?.country,
                city: authorDetails?.city,
            },
        }

        if (!wishlist) {
            const newCart = new Wishlist({
                userId: getUserId,
                items: [productDetails],
            })
            await newCart.save();
            await getUserDetails.updateOne({ $inc: { cartItemCount: 1 } })
            res.status(200).send(newCart);
        }

        if (wishlist) {
            wishlist.items.push(productDetails);
            await wishlist.save();
            await getUserDetails.updateOne({ $inc: { cartItemCount: 1 } })
            res.status(200).send(wishlist);
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}

module.exports.updateWishlistItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const wishlist = await Wishlist.findById(id);

        if (!wishlist) {
            return res.status(404).send("wishlist not found");
        } else {
            Object.assign(wishlist, updateData);
            await wishlist.save();
            res.status(200).send(wishlist);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}

module.exports.deleteWishlistItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;

        const wishlist = await Wishlist.findById(id);
        console.log(wishlist)

        const updatedWishlist = wishlist.items.filter((item) => item.productId != productId);

        if (!updatedWishlist) {
            return res.status(404).json({ message: 'wishlist not found or item not found in the wishlist' });
        } else {
            wishlist.items = updatedWishlist;
            await wishlist.save();
            res.status(200).json(wishlist);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


