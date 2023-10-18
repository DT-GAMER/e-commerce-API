const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isUserOrAdmin } = require('../middlewares/authMiddleware');
const { validateCartAddItem } = require('../middlewares/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's shopping cart.
 *     tags: [Cart]
 *     security:
 *       - userAuth: []
 *     responses:
 *       200:
 *         description: User's shopping cart.
 */
router.get('/cart', isUserOrAdmin, cartController.getUserShoppingCart);

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add item to the user's shopping cart.
 *     tags: [Cart]
 *     security:
 *       - userAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: Item added to the shopping cart.
 *       400:
 *         description: Product not found or quantity exceeds stock.
 */
router.post('/cart/add', isUserOrAdmin, validateCartAddItem, cartController.addToShoppingCart);

module.exports = router;

