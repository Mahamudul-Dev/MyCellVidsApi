const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    category: {
        type: String,
    },
    tags: [],
    duration: { type: String },
    thumbnail: {
        type: String,
        default: ''
    },
    downloadUrl: {
        type: String,
    },
    previewUrl: {
        type: String,
    },
    videoStatus: {
        type: String,
        default: 'active'
    },
    videoStrike: {
        type: Number,
        default: 0
    },
    totalSales: {
        type: Number,
        default: 0
    },
    viewsCount: {
        type: String,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    ratings: {
        type: Number,
        default: 0
    },
    reviews: [],
    uploadTimeStamp: {
        type: String,
    },
    updateTimeStamp: {
        type: String,
    }
});

module.exports = mongoose.model('Products', productSchema, 'Products');

