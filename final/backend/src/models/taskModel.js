const moment = require('moment-timezone');

const convertToTaipeiTime = (utcTime) => {
  return moment(utcTime).tz('Asia/Taipei').format('YYYY-MM-DDTHH:mm:ssZ');
};

// 从app.js传递pool实例，无需单独导入
const createTask = async (pool, task) => {
    const { questname, description, position, reward, selectedOption, endTime, userId } = task;
    const client = await pool.connect();
    try {
      const nowInTaipei = moment().tz('Asia/Taipei').format();
      const result = await client.query(
        `INSERT INTO QUEST (Quest_name, Quest_description, Quest_location, Quest_reward, Quest_reward_type, Seeker_UID , Quest_start_time, Quest_end_time) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [questname, description, position, reward, selectedOption, userId, nowInTaipei, convertToTaipeiTime(endTime)]
      );
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
      const result = await client.query('SELECT * FROM tasks');
      return result.rows;
    } catch (error) {
      console.error('Error fetching tasks from database:', error);
      throw error;
    } finally {
      client.release();
    }
  };
  
  module.exports = { createTask, getAllTasks };