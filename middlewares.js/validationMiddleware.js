const { validationResult, check } = require('express-validator');

// Middleware for validating user registration data
exports.validateUserRegistration = [
  check('fullName').notEmpty().withMessage('Full name is required'),
  check('username').isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('role').isIn(['user', 'admin']).withMessage('Invalid role'),
];

// Middleware for validating user login data
exports.validateUserLogin = [
  check('username').notEmpty().withMessage('Username is required'),
  check('password').notEmpty().withMessage('Password is required'),
];

// Middleware for validating product creation and update data
exports.validateProductData = [
  check('description').notEmpty().withMessage('Description is required'),
  check('price').isNumeric().withMessage('Price must be a number'),
  check('isInStock').isBoolean().withMessage('isInStock must be a boolean'),
  check('categoryID').notEmpty().withMessage('Category ID is required'),
  check('imageURL').isURL().withMessage('Invalid image URL'),
];

// Middleware for validating order creation data
exports.validateOrderData = [
  check('cartItems').isArray().withMessage('Cart items must be an array'),
  check('shippingInfo').isObject().withMessage('Shipping information must be an object'),
  check('paymentInfo').isObject().withMessage('Payment information must be an object'),
];

// Middleware to check validation errors
exports.checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

