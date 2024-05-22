import React, { useState } from 'react';
import '../App.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // 登入邏輯，比如發送API請求
    console.log('Submitting Login:', username, password);
    // 在這裡添加更多的登入邏輯，比如調用後端API
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>登入您的帳戶</h2>
        <form onSubmit={handleSubmit}>
          <div className="App-form-group">
            <label htmlFor="username">使用者名稱:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="App-form-group">
            <label htmlFor="password">密碼:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">登入</button>
        </form>
      </header>
    </div>
  );
}

export default Login;
