const axios = require('axios');
const jwt = require('jsonwebtoken');

const { insertOrUpdateUser } = require('./dbController'); // 引入数据库操作模块
require('dotenv').config();

exports.githubLogin = (req, res) => {
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}`;
    res.redirect(url);
};

exports.githubCallback = async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).send('Authorization code is required');
    }

    try {
        const response = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: process.env.GITHUB_CALLBACK_URL
        }, {
            headers: { accept: 'application/json' }
        });
        const { access_token } = response.data;

        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { 'Authorization': `token ${access_token}` }
        });

        console.log('GitHub User:', userResponse.data);
        console.log('GitHub Username:', userResponse.data.login);
        
        // 插入或更新数据库中的用户信息
        await insertOrUpdateUser(userResponse.data.login);
        const jwtToken = jwt.sign({ id: userResponse.data.id, login: userResponse.data.login }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(`http://localhost:3000/login?token=${jwtToken}&userName=${userResponse.data.login}`)
        res.redirect(`http://localhost:3000/login?token=${jwtToken}&userId=${userResponse.data.login}`);
    } catch (error) {
        if (error.response) {
            console.error('Error exchanging GitHub code for token:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        res.status(500).send('Authentication failed');
    }
};
