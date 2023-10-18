const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate user or admin
exports.authenticateUser = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify and decode the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database based on the token data
    User.findById(decoded.userId, (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Set the user in the request object for further use
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Middleware to check if the user is an admin
exports.checkAdminRole = (req, res, next) => {
  const user = req.user;

  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
};

// Middleware to check if the user is an admin or a user
exports.checkAdminOrUser = (req, res, next) => {
  const user = req.user;

  if (user.role !== 'admin' && user.role !== 'user') {
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
};

