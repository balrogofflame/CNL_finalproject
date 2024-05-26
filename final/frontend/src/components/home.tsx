import React, { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { CSSProperties } from 'react';

function Home() {
  
  const navigate = useNavigate();

  const titleStyle: CSSProperties = {
    fontSize: '3em',
    marginTop: '20px',
    color: '#333',
    textAlign: 'center',
  };

  

  return (
    <div className="App">
      <h1 style={titleStyle}>TRIUMA</h1> {/* 添加大标题 */}
    </div>
  );
}

export default Home;
