const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const userAuthController = require('../controllers/userAuthController'); 

// User registration
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: user123
 *               password:
 *                 type: string
 *                 example: password123
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/register', userAuthController.registerUser);

// User login
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: user123
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/login', userAuthController.loginUser);

// Admin registration
/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags:
 *       - Authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin123
 *               password:
 *                 type: string
 *                 example: adminPassword123
 *               fullName:
 *                 type: string
 *                 example: Admin User
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/admin/register', adminAuthController.registerAdmin);

// Admin login
/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin123
 *               password:
 *                 type: string
 *                 example: adminPassword123
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/admin/login', adminAuthController.loginAdmin);

module.exports = router;
