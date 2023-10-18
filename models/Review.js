const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  reviewText: {
    type: String,
    required: true,
  },
  reviewDate: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

