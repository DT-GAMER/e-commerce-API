const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/orderController');
const { isUserOrAdmin } = require('../middlewares/authMiddleware');
const { validatePayment } = require('../middlewares/validationMiddleware');
const paymentController = require('../controllers/paymentController');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Process a payment for an order.
 *     tags: [Payments]
 *     security:
 *       - userAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment processed successfully.
 *       400:
 *         description: Invalid payment data or payment failed.
 */
router.post('/payments', isUserOrAdmin, validatePayment, orderController.processPayment);

/**
 * @swagger
 * /payments/{orderId}:
 *   get:
 *     summary: Get payment information for an order.
 *     tags: [Payments]
 *     security:
 *       - userAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Payment information.
 *       404:
 *         description: Payment not found.
 */
router.get('/payments/:orderId', isUserOrAdmin, orderController.getPaymentByOrder);


/**
 * @openapi
 * /initialize-transaction:
 *   post:
 *     summary: Initialize a payment transaction.
 *     description: Initializes a payment transaction using Paystack API.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               amount:
 *                 type: number
 *             required:
 *               - email
 *               - amount
 *     responses:
 *       200:
 *         description: Successfully initialized a transaction.
 *       400:
 *         description: Bad request. Invalid data provided.
 *       500:
 *         description: Internal server error.
 */
router.post('/initialize-transaction', paymentController.initializeTransaction);

// Define route for verifying a transaction
/**
 * @openapi
 * /verify/{reference}:
 *   get:
 *     summary: Verify a Paystack transaction.
 *     parameters:
 *     - in: path
 *       name: reference
 *       required: true
 *       description: Transaction reference.
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Successful verification.
 *       400:
 *         description: Error in verification.
 */
router.get('/verify/:reference', paymentController.verifyTransaction);

// Define route for listing transactions
/**
 * @openapi
 * /transactions:
 *   get:
 *     summary: List Paystack transactions.
 *     responses:
 *       200:
 *         description: Successful transaction listing.
 *       400:
 *         description: Error in listing transactions.
 */
router.get('/transactions', paymentController.listTransactions);


// Define route for fetching transaction details
/**
 * @openapi
 * /transactions/{transactionId}:
 *   get:
 *     summary: Fetch details of a Paystack transaction.
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction ID.
 *     responses:
 *       200:
 *         description: Successful transaction details retrieval.
 *       400:
 *         description: Error in fetching transaction details.
 */
router.get('/transactions/:transactionId', paymentController.fetchTransaction);

// Define route for charging an authorization
/**
 * @openapi
 * /charge-authorization:
 *   post:
 *     summary: Charge a Paystack authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               amount:
 *                 type: string
 *               authorization_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful authorization charge.
 *       400:
 *         description: Error in charging the authorization.
 */
router.post('/charge-authorization', paymentController.chargeAuthorization);

// Define a route for viewing the timeline of a transaction
/**
 * @openapi
 * /transaction-timeline/{id_or_reference}:
 *   get:
 *     summary: Get the timeline of a Paystack transaction.
 *     parameters:
 *       - in: path
 *         name: id_or_reference
 *         required: true
 *         description: Transaction ID or reference
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful transaction timeline retrieval.
 *       400:
 *         description: Error in retrieving the transaction timeline.
 */
router.get('/transaction-timeline/:id_or_reference', paymentController.viewTransactionTimeline);

// Define a route for retrieving transaction totals
/**
 * @openapi
 * /transaction-totals:
 *   get:
 *     summary: Get the total amount received on your Paystack account.
 *     responses:
 *       200:
 *         description: Successful retrieval of transaction totals.
 *       400:
 *         description: Error in retrieving transaction totals.
 */
router.get('/transaction-totals', paymentController.getTransactionTotals);

// Define a route for exporting transactions
/**
 * @openapi
 * /export-transactions:
 *   get:
 *     summary: Export a list of transactions from Paystack.
 *     responses:
 *       200:
 *         description: Successful export of transactions.
 *       400:
 *         description: Error in exporting transactions.
 */
router.get('/export-transactions', paymentController.exportTransactions);

module.exports = router;
