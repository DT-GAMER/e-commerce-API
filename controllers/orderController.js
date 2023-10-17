const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

// Create a new order
exports.createOrder = async (req, res) => {
  const user = req.user;
  const { cartItems, shippingInfo, paymentInfo } = req.body;

  try {
    // Validate cart items and calculate the order total
    const orderItems = [];
    let orderTotal = 0;

    for (const item of cartItems) {
      const product = await Product.findById(item.productID);
      if (!product) {
        return res.status(400).json({ error: 'Product not found' });
      }

      const orderItem = {
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      };
      orderItems.push(orderItem);
      orderTotal += product.price * item.quantity;
    }

    // Create a new order
    const order = new Order({
      userID: user._id,
      orderItems,
      totalAmount: orderTotal,
      shippingInfo,
      paymentInfo,
      status: 'pending',
    });

    // Process payment with Paystack
    const paymentResponse = await paystack.transaction.initialize({
      email: user.email,
      amount: orderTotal * 100, // Amount in kobo
      reference: 'unique_order_reference', // Generate a unique reference
      callback_url: 'https://yourwebsite.com/payment-callback', // URL to handle payment callback
    });

    order.paymentReference = paymentResponse.data.reference;

    await order.save();
    res.status(201).json({ message: 'Order created successfully', paymentLink: paymentResponse.data.authorization_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Handle Paystack callback for payment status
exports.handlePaymentCallback = async (req, res) => {
  const reference = req.query.reference;

  try {
    const payment = await paystack.transaction.verify(reference);
    if (payment.status === 'success') {
      // Update order status to 'completed' if payment is successful
      const order = await Order.findOne({ paymentReference: reference });
      if (order) {
        order.status = 'completed';
        await order.save();
      }

      res.status(200).json({ message: 'Payment successful' });
    } else {
      res.status(400).json({ error: 'Payment failed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a user's order history
exports.getUserOrders = async (req, res) => {
  const user = req.user;
  try {
    const orders = await Order.find({ userID: user._id }).populate('orderItems.product');
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get details of a specific order by ID
exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate('orderItems.product');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the order is already canceled
    if (order.status === 'canceled') {
      return res.status(400).json({ error: 'Order is already canceled' });
    }

    // Initiate a refund
    const refundResponse = await paystack.transaction.refund({
      transaction: order.paymentReference,
      amount: order.totalAmount * 100, // Amount in kobo
    });

    // Update the order status to 'canceled'
    order.status = 'canceled';
    await order.save();

    res.status(200).json({ message: 'Order canceled successfully', refund: refundResponse.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

