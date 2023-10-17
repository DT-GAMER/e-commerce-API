const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get a user's shopping cart
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


exports.addToShoppingCart = async (req, res) => {
  const user = req.user;
  const { productID, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userID: user._id });

    // Check if the product exists
    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!cart) {
      // If the user doesn't have a cart, create one
      const newCart = new Cart({
        userID: user._id,
        cartItems: [{ product: productID, quantity }],
      });
      await newCart.save();
    } else {
      // If the user has a cart, update it
      const existingCartItem = cart.cartItems.find((item) => item.product.equals(product._id));
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
      } else {
        cart.cartItems.push({ product: productID, quantity });
      }
      await cart.save();
    }

    res.status(200).json({ message: 'Product added to the shopping cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove a product from the shopping cart
exports.removeFromShoppingCart = async (req, res) => {
  const user = req.user;
  const { productID } = req.params;

  try {
    const cart = await Cart.findOne({ userID: user._id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find and remove the product from the cart
    const updatedCartItems = cart.cartItems.filter((item) => !item.product.equals(productID));
    cart.cartItems = updatedCartItems;
    await cart.save();

    res.status(200).json({ message: 'Product removed from the shopping cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

