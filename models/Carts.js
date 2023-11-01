// cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    items: [],
});

module.exports = mongoose.model('Carts', cartSchema, 'Carts');

