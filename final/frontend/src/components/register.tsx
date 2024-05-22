import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        // 简单的密码确认逻辑
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log('Register Attempt:', username, password);
        // 这里添加注册逻辑，例如调用后端API
        // 注册成功后导航到登录页面
        navigate('/login');
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <label>
                    Confirm Password:
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </label>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
