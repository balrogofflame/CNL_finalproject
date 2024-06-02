const express = require('express');
const router = express.Router();
const { getCommentsByUid } = require('../models/profileModel'); // 确保导入 deleteTaskById

router.get('/api/:userId/comments', async (req, res) => {
    const pool = req.pool;
    const { userId } = req.params;
    try {
      const comments = await getCommentsByUid(pool, userId);
      res.json(comments);
    } catch (error) {
      res.status(500).send('Error fetching comments: ' + error.message);
    }
});

module.exports = router;
