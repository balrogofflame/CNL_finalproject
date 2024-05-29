const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const authController = require('../controllers/authController');

router.get('/auth/github', authController.githubLogin);
router.get('/auth/github/callback', authController.githubCallback);

router.post('/refreshtoken', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send('Token is required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const newToken = jwt.sign({ id: decoded.id, login: decoded.login }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token: newToken });
  } catch (error) {
    return res.status(500).send('Failed to refresh token');
  }
});

module.exports = router;
