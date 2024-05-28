import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import TaskList from './tasklist.tsx';

const Home = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValues, setInputValues] = useState({
    name: '',
    description: '',
    position: '',
    reward: '',
    endDate: '',
    endTime: ''
  });
  const [selectedOption, setSelectedOption] = useState('money');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleExpandClick = () => {
    setIsExpanded(true);
  };

  const handleCloseClick = () => {
    setIsExpanded(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
        <h1>TRIUMA</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div style={{ display: 'flex', height: 'calc(100vh - 50px)', marginTop: '20px' }}>
        <div style={{ flex: 1, background: '#f0f0f0' }}>
          <TaskList />
        </div>
        <div style={{
          width: '2px',
          background: '#000',
          margin: '0 10px',
        }}></div>
        <div style={{ flex: 1, background: '#ffffff', padding: '20px', position: 'relative' }}>
          <button onClick={handleExpandClick}>
            Expand
          </button>
          {isExpanded && (
            <div style={{ marginTop: '20px' }}>
              <h2>Expanded View</h2>
              <div>
                <label>
                  任務名稱:
                  <input
                    type="text"
                    name="name"
                    value={inputValues.name}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  任務內容:
                  <input
                    type="text"
                    name="description"
                    value={inputValues.description}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  任務地點:
                  <input
                    type="text"
                    name="position"
                    value={inputValues.position}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  報酬種類:
                  <select value={selectedOption} onChange={handleSelectChange}>
                    <option value="money">金錢(新台幣)</option>
                    <option value="food">食物</option>
                    <option value="others">其他</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  報酬內容:
                  <input
                    type="text"
                    name="reward"
                    value={inputValues.reward}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  結束日期:
                  <input
                    type="date"
                    name="endDate"
                    value={inputValues.endDate}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  結束時間:
                  <input
                    type="time"
                    name="endTime"
                    value={inputValues.endTime}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <button disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
              </button>
              <button onClick={handleCloseClick}>Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
