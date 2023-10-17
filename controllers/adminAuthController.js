const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); 
const config = require('../config/config'); 
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to check if the user is an admin
exports.isAdmin = authMiddleware.checkRole('admin');

// Protected route for administrators
exports.adminDashboard = (req, res) => {

  // Only administrators can access this route
  res.status(200).json({ message: 'Admin Dashboard' });
};

// Register a new admin
exports.registerAdmin = async (req, res) => {
  try {
    const { fullName, username, password } = req.body;

    // Check if the username is already taken
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Username is already in use' });
    }

    // Hash the password and create a new admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ fullName, username, password: hashedPassword, role: 'admin' });

    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login an admin
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a token with the 'admin' role
    const token = jwt.sign({ userId: admin._id, role: 'admin' }, config.jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

