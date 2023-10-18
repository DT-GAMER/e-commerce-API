const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isInStock: {
    type: Boolean,
    required: true,
  },
  imageURL: {
    type: String,
  },
  categoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

