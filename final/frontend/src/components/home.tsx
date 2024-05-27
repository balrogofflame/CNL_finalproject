import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Home = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleButtonClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
        <h1>TRIUMA</h1> {/* Preserving the main title */}
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div style={{ display: 'flex', height: 'calc(100vh - 50px)', marginTop: '20px' }}>
        <div style={{ flex: 1, background: '#f0f0f0' }}>
          {/* Left half content */}
        </div>
        <div style={{
          width: '2px',
          background: '#000',
          margin: '0 10px',
        }}></div>
        <div style={{ flex: 1, background: '#ffffff', padding: '20px', position: 'relative' }}>
          <button onClick={handleButtonClick}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
          {isExpanded && (
            <div style={{ marginTop: '20px' }}>
              <ul>
                <li>Option 1</li>
                <li>Option 2</li>
                <li>Option 3</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
