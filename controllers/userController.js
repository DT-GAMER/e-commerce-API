const bcrypt = require('bcrypt');
const User = require('../models/User');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user profile
exports.getUserProfile = (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const user = req.user;
  const { fullName, username, password } = req.body;

  try {
    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's order history
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

// Get user's shopping cart
exports.getUserShoppingCart = async (req, res) => {
  const user = req.user;
  try {
    const cart = await Cart.findOne({ userID: user._id }).populate('cartItems.product');
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add item to user's shopping cart
exports.addToShoppingCart = async (req, res) => {
  const user = req.user;
  const { productID, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userID: user._id });

    if (!cart) {
      cart = new Cart({ userID: user._id, cartItems: [] });
    }

    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const item = cart.cartItems.find((cartItem) => cartItem.productID.equals(product._id));
    if (item) {
      // If the item already exists in the cart, update the quantity
      item.quantity += quantity;
    } else {
      // If the item is not in the cart, add it
      cart.cartItems.push({ productID, quantity, price: product.price });
    }

    // Calculate the cart total
    const cartTotal = cart.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    cart.total = cartTotal;

    await cart.save();
    res.status(200).json({ message: 'Item added to the shopping cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }

    await cart.save();
    res.status(200).json({ message: 'Item added to the shopping cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

