// Error handling middleware
exports.errorHandler = (err, req, res, next) => {
  console.error(err);

  // Handle known errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Handle custom application-specific errors
  if (err.name === 'CustomError') {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Handle other unhandled errors
  res.status(500).json({ error: 'Server error' });
};

// Middleware for handling 404 (Not Found) errors
exports.notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
};

