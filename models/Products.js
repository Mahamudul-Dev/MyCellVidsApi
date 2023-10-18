const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productImg: String, // Assuming the image is a URL or file path
    name: String,
    mainCategory: String,
    subCategory: String,
    oldPrice: Number, // Assuming it's a numeric value
    newPrice: Number, // Assuming it's a numeric value
    rating: Number, // Assuming it's a numeric value
    reactions: Number, // Assuming it's a numeric value
});

module.exports = mongoose.model('Products', productSchema, 'Products');