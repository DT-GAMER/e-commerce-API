const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cartItems: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

