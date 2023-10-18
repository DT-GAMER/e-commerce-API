const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct, validateProductUpdate } = require('../middlewares/validationMiddleware');
const { isAdmin, isUserOrAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get a list of all products.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products.
 */
router.get('/products', productController.getAllProducts);

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Get a single product by ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: A single product.
 *       404:
 *         description: Product not found.
 */
router.get('/products/:productId', productController.getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (admin only).
 *     tags: [Products]
 *     security:
 *       - adminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       400:
 *         description: Category not found.
 */
router.post('/products', isAdmin, validateProduct, productController.createProduct);

/**
 * @swagger
 * /products/{productId}:
 *   put:
 *     summary: Update a product by ID (admin only).
 *     tags: [Products]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdate'
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       400:
 *         description: Category not found.
 *       404:
 *         description: Product not found.
 */
router.put('/products/:productId', isAdmin, validateProductUpdate, productController.updateProduct);

/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: Delete a product by ID (admin only).
 *     tags: [Products]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully.
 *       404:
 *         description: Product not found.
 */
router.delete('/products/:productId', isAdmin, productController.deleteProduct);

module.exports = router;

