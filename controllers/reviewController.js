const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');

// Create a product review
exports.createReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, reviewText } = req.body;
  const user = req.user;

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the user has already reviewed this product
    const existingReview = await Review.findOne({ product: productId, user: user._id });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // Create a new review
    const review = new Review({
      product: productId,
      user: user._id,
      rating,
      reviewText,
    });

    await review.save();
    res.status(201).json({ message: 'Review created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get all reviews for the product
    const reviews = await Review.find({ product: productId }).populate('user', 'fullName');
    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a review by ID (admin or owner only)
exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const user = req.user;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if the user is the owner of the review or an admin
    if (user.role === 'admin' || review.user.equals(user._id)) {
      await review.remove();
      res.status(204).end();
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

