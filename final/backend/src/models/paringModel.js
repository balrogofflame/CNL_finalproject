const { Pool } = require('pg');
require('dotenv').config();

const getQuestsAcceptStatus = async (pool, userId) => {
    const client = await pool.connect();
    try {
      const statusQuery = `
        SELECT q.Quest_name, q.Quest_description, q.Quest_location, q.Quest_end_time, a.Accept_status
        FROM QUEST AS q
            JOIN ACCEPT AS a ON q.Quest_ID = a.Quest_ID
        WHERE q.Quest_ID IN
        (
            SELECT Quest_ID
            FROM ACCEPT
            WHERE User_ID = $1
        )
        `;
      const statusResult = await client.query(statusQuery, [userId]);
      return statusResult.rows;
    } catch (error) {
      console.error('Error fetching quests accept status from database:', error);
      throw error;
    } finally {
      client.release();
    }
};

const getMyQuestAcceptStatus = async (pool, userId) => {
    const client = await pool.connect();
    try {
      const statusQuery = `
        SELECT q1.Quest_ID, q1.Quest_Name, u.User_ID, u.User_name, u.User_rating, a1.Distance
        FROM USER_ AS u
            JOIN ACCEPT AS a1 ON a1.User_ID = u.User_ID AND (a1.Accept_status = 'pending' OR a1.Accept_status = 'accepted')
            JOIN QUEST AS q1 ON q1.Quest_ID = a1.Quest_ID AND q1.Quest_status = 'inprogress'
        WHERE u.User_ID IN
        (
            SELECT a2.User_ID
            FROM ACCEPT AS a2
            WHERE (a2.Accept_status = 'pending' OR a2.Accept_status = 'accepted') AND a2.Quest_ID IN
            (
            SELECT q2.Quest_ID
            FROM QUEST AS q2
            WHERE q2.Seeker_UID = $1 and q2.Quest_status = 'inprogress'
            )
        )
        `;
      const statusResult = await client.query(statusQuery, [userId]);
      return statusResult.rows;
    } catch (error) {
      console.error('Error fetching my accept status from database:', error);
      throw error;
    } finally {
      client.release();
    }
};

module.exports = { getQuestsAcceptStatus, getMyQuestAcceptStatus };