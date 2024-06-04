const moment = require('moment-timezone');
const { Pool } = require('pg');
require('dotenv').config();

const convertToTaipeiTime = (utcTime) => {
  return moment(utcTime).tz('Asia/Taipei').format('YYYY-MM-DDTHH:mm:ssZ');
};

// 从app.js传递pool实例，无需单独导入
const createTask = async (pool, task) => {
    const { questname, description, position, reward, selectedOption, endTime, quest_longitude, quest_latitude, userId } = task;
    const client = await pool.connect();
    try {
      await client.query('BEGIN'); // 开始事务

      const result = await client.query(
        `INSERT INTO QUEST (Quest_name, Quest_description, Quest_location, Quest_logitude, Quest_latitude, Quest_reward, Quest_reward_type, Seeker_UID , Quest_end_time) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [questname, description, position, quest_longitude, quest_latitude, reward, selectedOption, userId, convertToTaipeiTime(endTime)]
      );
      //console.log(userId)
      await client.query(
        `UPDATE USER_ SET User_quest_quota = User_quest_quota - 1 WHERE User_ID = $1`,
        [userId]
      );
  
      await client.query('COMMIT'); // 提交事务
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting task into database:', error);
      throw error;
    } finally {
      client.release();
    }
  };
  
const getAllTasks = async (pool) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT t.*, u.User_name, u.User_rating 
         FROM quest t
         JOIN USER_ u ON t.Seeker_UID = u.user_id`
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching tasks from database:', error);
      throw error;
    } finally {
      client.release();
    }
  };

  const getTaskById = async (pool, taskId) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM quest WHERE quest_id = $1`,
        [taskId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching task from database:', error);
      throw error;
    } finally {
      client.release();
    }
  };
  
const deleteTaskById = async (pool, taskId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // 开始事务
    await client.query('DELETE FROM QUEST WHERE Quest_ID = $1', [taskId]);
    await client.query('COMMIT'); // 提交事务
  } catch (error) {
    await client.query('ROLLBACK'); // 回滚事务
    console.error('Error deleting task from database:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { createTask, getAllTasks, getTaskById, deleteTaskById };