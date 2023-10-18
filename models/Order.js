const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'completed', 'canceled'],
    default: 'pending',
  },
  paymentReference: {
    type: String,
  },
  shippingInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShippingInfo',
  },
  paymentInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentInfo',
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

