const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'your_default_connection_string';

// 创建一个连接池
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const findUserByName = async (username) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM USER_ WHERE User_name = $1`,
      [username]
    );
    return result.rows; // 返回查询结果的行
  } catch (error) {
    console.error('Error querying database:', error);
    return []; // 返回空数组表示未找到用户
  } finally {
    client.release();
  }
};

const insertUser = async (username) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO USER_ (User_name) 
       VALUES ($1) RETURNING *`,
      [username]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting into database:', error);
    throw error;
  } finally {
    client.release();
  }
};

const insertOrUpdateUser = async (username) => {
  const existingUsers = await findUserByName(username);
  if (existingUsers.length === 0) {
    const newUser = await insertUser(username);
    return newUser;
  } else {
    console.log('User already exists:', existingUsers[0]);
    return existingUsers[0];
  }
};

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

// 在启动时测试连接
testConnection();

module.exports = { findUserByName, insertUser, insertOrUpdateUser };
