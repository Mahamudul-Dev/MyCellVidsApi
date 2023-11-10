const express = require('express');
const app = express.Router();

const favouriteController = require('../../controllers/favourite.controller');
const { auth } = require('../../middleware/auth');

app.get('/', auth, favouriteController.allFavouriteItem);
app.post('/addItemToFavourite', auth, favouriteController.addItemToFavourite);
app.put('/:id', auth, favouriteController.updateFavouriteItem);
app.delete('/:id', auth, favouriteController.deleteFavouriteItem);

module.exports = app