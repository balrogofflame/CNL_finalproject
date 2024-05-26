// backend/src/controllers/authController.js
const axios = require('axios');
require('dotenv').config();

exports.githubLogin = (req, res) => {
    // 确保这里使用的是后端的环境变量
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

        // 使用access_token请求GitHub API获取用户信息
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { 'Authorization': `token ${access_token}` }
        });

        console.log('GitHub User:', userResponse.data);
        console.log('GitHub Username:', userResponse.data.login);  // 打印用户名

        // 可以继续处理用户信息，例如存储到数据库等
        // 重定向回前端应用，可能带上需要的用户信息或状态
        res.redirect(`http://localhost:3000/login?token=${access_token}`);
    } catch (error) {
        console.error('Error exchanging GitHub code for token:', error.response.data);
        res.status(500).send('Authentication failed');
    }
};

