const express = require('express');
const app = express.Router();

const wishlistController = require('../../controllers/wishlist.controller');
const { auth } = require('../../middleware/auth');

app.get('/', auth, wishlistController.allWishlistItem);
app.post('/addItemToWishlist', auth, wishlistController.addItemToWishlist);
app.put('/:id', auth, wishlistController.updateWishlistItem);
app.delete('/:id', auth, wishlistController.deleteWishlistItem);

module.exports = app