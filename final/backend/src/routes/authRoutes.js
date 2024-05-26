// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/auth/github', authController.githubLogin);
router.get('/auth/github/callback', authController.githubCallback);

module.exports = router;
