const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/refresh-token
router.post('/refresh-token', authController.refreshToken);

// POST /api/auth/logout
router.post('/logout', authenticate, authController.logout);

// GET  /api/auth/me
router.get('/me', authenticate, authController.getMe);

// PUT  /api/auth/update-profile
router.put('/update-profile', authenticate, authController.updateProfile);

// POST /api/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', authController.resetPassword);

// GET  /api/auth/verify-email/:token
router.get('/verify-email/:token', authController.verifyEmail);

module.exports = router;
