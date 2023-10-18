const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isUserOrAdmin } = require('../middlewares/authMiddleware');
const { validateOrder } = require('../middlewares/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order.
 *     tags: [Orders]
 *     security:
 *       - userAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully.
 *       400:
 *         description: Cart is empty or contains out-of-stock items.
 */
router.post('/orders', isUserOrAdmin, validateOrder, orderController.createOrder);

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get a single order by ID.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: A single order.
 *       404:
 *         description: Order not found.
 */
router.get('/orders/:orderId', isUserOrAdmin, orderController.getOrderById);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get user's order history.
 *     tags: [Orders]
 *     security:
 *       - userAuth: []
 *     responses:
 *       200:
 *         description: User's order history.
 */
router.get('/orders', isUserOrAdmin, orderController.getUserOrders);

/**
 * @swagger
 * /orders/{orderId}/cancel:
 *   post:
 *     summary: Cancel an order.
 *     tags: [Orders]
 *     security:
 *       - userAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order canceled successfully.
 *       404:
 *         description: Order not found or cannot be canceled.
 */
router.post('/orders/:orderId/cancel', isUserOrAdmin, orderController.cancelOrder);

module.exports = router;

