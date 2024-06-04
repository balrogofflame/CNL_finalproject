import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TaskAccepts = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!authToken || !userId) {
      navigate('/login');
    } else {
      setToken(authToken);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTask = async () => {
      if (token) {
        try {
          const response = await axios.get(`http://localhost:5000/api/accept/request/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          setTask(response.data);
          setLoading(false);
        } catch (error) {
          if (error.response && error.response.data && error.response.data.message === 'jwt expired') {
            try {
              const refreshResponse = await axios.post('http://localhost:5000/refreshtoken', { token }); // 确保路径正确
              const newToken = refreshResponse.data.token;
              localStorage.setItem('authToken', newToken);
              setToken(newToken);

              // 重新尝试请求
              const retryResponse = await axios.get(`http://localhost:5000/api/accept/request/${id}`, {
                headers: {
                  Authorization: `Bearer ${newToken}`,
                }
              });
              setTask(retryResponse.data);
              setLoading(false);
            } catch (refreshError) {
              console.error('Error refreshing token:', refreshError);
              navigate('/login');
            }
          } else {
            console.error('Error fetching task:', error);
            navigate('/home');
          }
        }
      }
    };

    fetchTask();
  }, [id, navigate, token]);

  const handleRefreshClick = async () => {
    console.log('gethehaeaw');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, background: '#f0f0f0', padding: '20px' }}>
        <h2>Task Details</h2>
        <p><strong>任務名稱:</strong> {task.quest_name}</p>
        <p><strong>任務內容:</strong> {task.quest_description}</p>
        <p><strong>任務地點:</strong> {task.quest_location}</p>
        <p><strong>報酬種類:</strong> {task.quest_reward_type}</p>
        <p><strong>報酬內容:</strong> {task.quest_reward}</p>
        <p><strong>結束時間:</strong> {new Date(task.quest_end_time).toLocaleString()}</p>
        <button onClick={handleRefreshClick}>刷新</button>
      </div>
    </div>
  );
};

export default TaskAccepts;