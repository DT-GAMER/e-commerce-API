const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: String,
    required: true,
  },
  transactionID: {
    type: String,
    required: true,
  },
   paystackReference: {
    type: String,
    required: true,
  },
  paystackStatus: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'successful', 'failed'],
    default: 'pending',
  },
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  paymentAmount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

