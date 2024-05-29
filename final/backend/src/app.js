const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const reportRoutes = require('./routes/reportRoutes'); // 新增的路由

const app = express();
app.use(cors());
app.use(express.json());

const connectionString = process.env.DATABASE_URL || 'your_default_connection_string';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// 测试数据库连接
const testConnection = async () => {
  const client = await pool.connect();
  try {
    await client.query('SELECT NOW()');
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    client.release();
  }
};

testConnection();

app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.use('/', authRoutes); // 确保路径正确
app.use('/', taskRoutes);
app.use('/', reportRoutes); // 使用新增的路由

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
