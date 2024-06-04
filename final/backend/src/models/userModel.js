const { Pool } = require('pg');
require('dotenv').config();

// 从app.js传递pool实例，无需单独导入
const reportTask = async (pool, taskId, userId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // 开始事务

    // 更新任务的举报状态（如果有需要的话，这里假设您有一个字段来标记任务是否被举报）
    

    // 更新用户的举报配额
    console.log(userId);
    const result = await client.query(
      `UPDATE USER_ SET user_report_quota = user_report_quota - 1 WHERE user_id = $1 RETURNING user_report_quota`,
      [userId]
    );
    console.log(result.rows[0])
    await client.query('COMMIT'); // 提交事务
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK'); // 回滚事务
    console.error('Error reporting task in database:', error);
    print(error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { reportTask };