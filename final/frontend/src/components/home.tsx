import React, { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // 登入邏輯，比如發送API請求

    // 在這裡添加更多的登入邏輯，比如調用後端API
  };

  const handleRegister = (e) =>{
    navigate('/register');
  };


  return (
    <div className="App">
      <p>Home</p>
    </div>
  );
}

export default Home;
