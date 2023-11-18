const express = require('express');
const app = express.Router();

const productController = require('../../controllers/product.controller');
const { auth } = require('../../middleware/auth');

app.get('/', auth, productController.allProducts);
app.get('/allProducts', auth, productController.getByFiltering);
app.get('/search', auth, productController.getBySearch);
app.get('/searchByCategory', auth, productController.searchByCategory);
app.get('/:id', auth, productController.singleProduct);
app.get('/:id', auth, productController.singleProduct);
app.get('/category/:category', auth, productController.findByCategory);
app.post('/', auth, upload.single('productImg'), productController.addProduct);
app.put('/:id', auth, upload.single('productImg'), productController.updateProduct);
app.delete('/:id', auth, productController.deleteProduct);

module.exports = app