const express = require('express');
const router = express.Router();
const { reportTask } = require('../models/userModel');

// 创建举报任务的路由
router.post('/api/report', async (req, res) => {
  const { taskId, userId } = req.body; // 从请求中获取任务 ID 和用户 ID
  const pool = req.pool;

  // 数据验证
  if (!taskId || !userId) {
    return res.status(400).send('Task ID and User ID are required.');
  }

  try {
    const result = await reportTask(pool, taskId, userId);
    if (result && result.user_report_quota !== undefined) {
      res.status(200).json({ message: 'Task reported successfully', quota: result.user_report_quota }); // 确保属性名正确
    } else {
      res.status(500).send('Error reporting task: Report quota not found');
    }
  } catch (error) {
    res.status(500).send('Error reporting task: ' + error.message);
  }
});

module.exports = router;