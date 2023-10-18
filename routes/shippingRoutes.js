const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isUserOrAdmin } = require('../middlewares/authMiddleware');
const { validateShipping } = require('../middlewares/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Shipping
 *   description: Shipping management
 */

/**
 * @swagger
 * /orders/{orderId}/shipping:
 *   post:
 *     summary: Add shipping information for an order.
 *     tags: [Shipping]
 *     security:
 *       - userAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shipping'
 *     responses:
 *       201:
 *         description: Shipping information added successfully.
 *       400:
 *         description: Invalid shipping data.
 */
router.post('/orders/:orderId/shipping', isUserOrAdmin, validateShipping, orderController.addShippingInfo);

/**
 * @swagger
 * /orders/{orderId}/shipping:
 *   get:
 *     summary: Get shipping information for an order.
 *     tags: [Shipping]
 *     security:
 *       - userAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Shipping information.
 *       404:
 *         description: Shipping information not found.
 */
router.get('/orders/:orderId/shipping', isUserOrAdmin, orderController.getShippingInfo);

module.exports = router;

