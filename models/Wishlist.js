// wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    items: [],
});

module.exports = mongoose.model('Wishlists', wishlistSchema, 'Wishlists');

