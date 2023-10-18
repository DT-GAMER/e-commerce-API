const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
  orderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const Shipping = mongoose.model('Shipping', shippingSchema);

module.exports = Shipping;

