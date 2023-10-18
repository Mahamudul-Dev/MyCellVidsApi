const express = require('express');
const app = express.Router();

const productController = require('../../controllers/product.controller');

app.get('/', productController.allProducts);
app.get('/:id', productController.singleProduct);
app.get('/category/:category', productController.findByCategory);
app.post('/', upload.single('productImg'), productController.addProduct);
app.put('/:id', upload.single('productImg'), productController.updateProduct);
app.delete('/:id', productController.deleteProduct);

module.exports = app