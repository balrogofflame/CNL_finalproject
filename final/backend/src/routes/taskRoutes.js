const express = require('express');
const router = express.Router();
const { createTask, getAllTasks, getTaskById, deleteTaskById, acceptTask } = require('../models/taskModel'); // 确保导入 deleteTaskById
const jwt = require('jsonwebtoken');

// 创建新任务
router.post('/api/request', async (req, res) => {
  const { questname, description, position, reward, selectedOption, endTime, quest_longitude, quest_latitude, userId } = req.body;
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
      quest_longitude,
      quest_latitude,
      userId
    };
    const createdTask = await createTask(pool, task);
    res.status(200).json(createdTask); // 返回创建的任务数据
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

// 获取任务详情
router.get('/api/request/:id', async (req, res) => {
  const pool = req.pool;
  const { id } = req.params;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('Authorization header is required.');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const task = await getTaskById(pool, id);

    if (!task) {
      return res.status(404).send('Task not found.');
    }

    if (task.seeker_uid !== decoded.id) {
      return res.status(403).send('You do not have permission to view this task.');
    }

    res.status(200).json(task);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ message: 'jwt expired' });
    }
    console.error('Error fetching task:', error);
    res.status(500).send('Error fetching task: ' + error.message);
  }
});



router.delete('/api/request/:id', async (req, res) => {
  const pool = req.pool;
  const { id } = req.params;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('Authorization header is required.');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const task = await getTaskById(pool, id);

    if (!task) {
      return res.status(404).send('Task not found.');
    }

    if (task.seeker_uid !== decoded.id) {
      return res.status(403).send('You do not have permission to delete this task.');
    }

    await deleteTaskById(pool, id);
    res.status(200).send('Task deleted successfully.');
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ message: 'jwt expired' });
    }
    console.error('Error deleting task:', error);
    res.status(500).send('Error deleting task: ' + error.message);
  }
});

router.get('/api/accept/request/:id', async (req, res) => {
  const pool = req.pool;
  const { id } = req.params;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('Authorization header is required.');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(id)
    const task = await getTaskById(pool, id);
    //console.log(task);
    if (!task) {
      return res.status(404).send('Task not found.');
    }

    res.status(200).json(task);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ message: 'jwt expired' });
    }
    console.error('Error fetching task:', error);
    res.status(500).send('Error fetching task: ' + error.message);
  }
});

router.post('/api/accept-task/:id', async (req, res) => {
  const pool = req.pool;
  const { id } = req.params; // 任務 ID
  const { userId } = req.body; // 接收用户 ID
  console.log(userId);
  try {
    const task = await getTaskById(pool, id);
    console.log(id);
    if (!task) {
      return res.status(404).send('Task not found.');
    }

    // 假定 acceptTask 是用來更新任務的函數，這裡我們不再傳遞用戶 ID 因為不做授權檢查
    const updatedTask = await acceptTask(pool, id, userId);
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error accepting task:', error);
    res.status(500).send('Error accepting task: ' + error.message);
  }
});


module.exports = router;
