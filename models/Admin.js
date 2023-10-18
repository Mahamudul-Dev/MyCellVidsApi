// Import Mongoose
const mongoose = require('mongoose');

// Define the Admin schema
const adminSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin', // You can modify this for different roles if needed
  },
  createdAt: {
    type: String,
    default: 'N/A',
  },
  updateTime: {
    type: String,
    default: 'N/A',
  },
});

// Create the Admin model
const Admin = mongoose.model('Admin', adminSchema, 'Admin');

// Export the model
module.exports = Admin;
