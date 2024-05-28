const express = require('express');
const router = express.Router();
const { createTask, getAllTasks } = require('../models/taskModel');

// 创建新任务
router.post('/api/request', async (req, res) => {
  const { questname, description, position, reward, selectedOption, endTime, userId } = req.body;
  const pool = req.pool;

  // 数据验证
  if (!questname || !description || !position || !reward || !selectedOption || !endTime || !userId) {
    return res.status(400).send('All fields are required.');
  }

  if (selectedOption === 'money' && isNaN(reward)) {
    return res.status(400).send('Reward must be a number when selectedOption is money.');
  }

  const endDateTime = new Date(endTime);
  if (isNaN(endDateTime.getTime()) || endDateTime <= new Date()) {
    return res.status(400).send('Invalid end date or time.');
  }

  try {
    const task = {
      questname,
      description,
      position,
      reward,
      selectedOption,
      endTime: endDateTime.toISOString(),
      timestamp: new Date().toISOString(),
      userId
    };
    console.log("Hi")
    const newTask = await createTask(pool, task);
    res.status(200).send('Task created successfully');
  } catch (error) {
    res.status(500).send('Error creating task: ' + error.message);
  }
});

// 获取所有任务
router.get('/api/tasks', async (req, res) => {
  const pool = req.pool;
  try {
    const tasks = await getAllTasks(pool);
    res.json(tasks);
  } catch (error) {
    res.status(500).send('Error fetching tasks: ' + error.message);
  }
});

module.exports = router;
