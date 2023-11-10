// favourite.js
const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    items: [],
});

module.exports = mongoose.model('Favourites', favouriteSchema, 'Favourites');

