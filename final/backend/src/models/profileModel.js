const { Pool } = require('pg');
require('dotenv').config();

const getCommentsByUid = async (pool, userId) => {
    const client = await pool.connect();
    try {  
      const commentsQuery = `
        SELECT * FROM COMMENT 
        WHERE Quest_ID IN (
            SELECT Quest_ID FROM QUEST 
            WHERE Seeker_UID = $1 OR Helper_UID = $1
        )
        `;
      const commentsResult = await client.query(commentsQuery, [userId]);
      return commentsResult.rows;
    } catch (error) {
      console.error('Error fetching comments from database:', error);
      throw error;
    } finally {
      client.release();
    }
};

module.exports = { getCommentsByUid };