import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import TaskList from './tasklist.tsx';
import axios from 'axios';
/*
const geoFindMe = () => {
 
  if (!navigator.geolocation) {
    console.log("<p>Geolocation is not supported by your browser</p>");
    return;
  }

  function success(position) {
    var longitude = parseFloat(position.coords.longitude);
    var latitude = parseFloat(position.coords.latitude);

    console.log(latitude, longitude)
  }

  function error() {
    console.log("Unable to retrieve your location");
  }
  navigator.geolocation.getCurrentPosition(success, error);

}*/

const Home = () => {
  const geoFindMe = () => {
    if (!navigator.geolocation) {
      console.log("<p>Geolocation is not supported by your browser</p>");
      return;
    }
  
    function success(position) {
      var longitude = position.coords.longitude;
      var latitude = position.coords.latitude;
  
      // 更新状态以存储经度和纬度
      setLocation({ longitude, latitude });
  
      //console.log(latitude, longitude)
    }
  
    function error() {
      console.log("Unable to retrieve your location");
    }
    navigator.geolocation.getCurrentPosition(success, error);
  }
  
  const [location, setLocation] = useState({ longitude: String, latitude: String });
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValues, setInputValues] = useState({
    questname: '',
    description: '',
    position: '',
    reward: '',
    endDate: '',
    endTime: ''
  });
  const [selectedOption, setSelectedOption] = useState('money'); // Set default value to "money"
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // 修改这里，设置类型为 string | null
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    // 调用geoFindMe函数来获取地理位置信息
    geoFindMe();
    // 其他useEffect逻辑...
  }, []); // 确保这个effect只在组件挂载时运行

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId); // 此处不会再报错
    } else {
      // Handle case where userId is not found, e.g., redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const handleExpandClick = () => {
    setIsExpanded(true);
  };

  


  const handleSendClick = async () => {

    // Validate endDate and endTime
    if (!inputValues.endDate || !inputValues.endTime) {
      alert('Please select a valid end date and time.');
      return;
    }

    const endDateTime = new Date(`${inputValues.endDate}T${inputValues.endTime}`);
    if (isNaN(endDateTime.getTime())) {
      alert('Invalid end date or time.');
      return;
    }

    // Validation: Ensure the selected end date and time are in the future
    if (endDateTime <= new Date()) {
      alert('The selected end time must be in the future.');
      return;
    }

    // Validate reward input if selected option is "money"
    if (selectedOption === 'money') {
      if (/[^0-9]/.test(inputValues.reward)) {
        alert('Please enter only numeric values for money.');
        setInputValues((prevValues) => ({
          ...prevValues,
          reward: ''
        }));
        setLoading(false);
        return;
      }
    }

    const data = {
      questname: inputValues.questname,
      description: inputValues.description,
      position: inputValues.position,
      reward: inputValues.reward,
      selectedOption: selectedOption,
      endTime: endDateTime.toISOString(),
      quest_longitude: location.longitude,
      quest_latitude: location.latitude,
      userId: userId // Add userId to the task data
    };

    console.log(data);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/request', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        const returnedData = response.data; // 获取后端返回的数据
        console.log('Data sent successfully', returnedData);
        navigate(`/task-details/${returnedData.quest_id}`); // 传递任务ID到新页面
      } else {
        console.error('Error sending data:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending data:', error);
    } finally {
      setLoading(false);
    }
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
        <h1>TRIUMA</h1> {/* Preserving the main title */}
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div style={{ display: 'flex', height: 'calc(100vh - 50px)', marginTop: '20px' }}>
        <div style={{ flex: 1, background: '#f0f0f0' }}>
          {userId &&<TaskList userId={userId}/>}
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
                    name="questname"
                    value={inputValues.questname}
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
              <button onClick={handleSendClick} disabled={loading}>
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
