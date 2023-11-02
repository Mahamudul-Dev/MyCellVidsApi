const express = require('express');
const app = express.Router();

const cartController = require('../../controllers/cart.controller');
const { auth } = require('../../middleware/auth');

app.get('/', auth, cartController.allCarts);
app.post('/addItemToCart', auth, cartController.addItemToCart);
app.put('/:id', auth, cartController.updateCart);
app.delete('/:id', auth, cartController.deleteCart);

module.exports = app