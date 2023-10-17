const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const authMiddleware = require('../middleware/authMiddleware');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { fullName, username, password } = req.body;

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already in use' });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, username, password: hashedPassword, role: 'user' });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a token with the 'user' role
    const token = jwt.sign({ userId: user._id, role: 'user' }, config.jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Middleware to check if the user is a User
exports.isUser = authMiddleware.checkRole('User');

// Protected route for user
exports.userDashboard = (req, res) => {
  // Only user can access this route
  res.status(200).json({ message: 'User Dashboard' });
};

// Admins only: Get a list of all users
exports.getAllUsers = async (req, res) => {
  try {
    // Check if the user is an admin (role-based access control)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

