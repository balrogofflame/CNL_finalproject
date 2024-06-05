const express = require('express');
const router = express.Router();
const { getQuestsAcceptStatus, getMyQuestAcceptStatus, updateQuestAndAcceptStatus } = require('../models/paringModel'); // 确保导入 deleteTaskById

router.get('/api/:userId/quests-status', async (req, res) => {
    const pool = req.pool;
    const { userId } = req.params;
    try {
      const status = await getQuestsAcceptStatus(pool, userId);
      res.json(status);
    } catch (error) {
      res.status(500).send('Error fetching quests-status: ' + error.message);
    }
});

router.get('/api/:userId/accept-status', async (req, res) => {
    const pool = req.pool;
    const { userId } = req.params;
    try {
      const status = await getMyQuestAcceptStatus(pool, userId);
      res.json(status);
    } catch (error) {
      res.status(500).send('Error fetching accept-status: ' + error.message);
    }
});

router.post('/api/:userId/accept-helper', async (req, res) => {
    const pool = req.pool;
    const { helper_uid, quest_id } = req.body;
    const { userId } = req.params;
    try {
        const para = {
            quest_id,
            userId,
            helper_uid
          };
          console.log(para)
      const status = await updateQuestAndAcceptStatus(pool, para);
      res.json(status);
    } catch (error) {
      res.status(500).send('Error fetching accept-status: ' + error.message);
    }
});

module.exports = router;
