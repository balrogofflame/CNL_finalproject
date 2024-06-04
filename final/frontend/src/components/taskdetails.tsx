import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [acceptedUsers, setAcceptedUsers] = useState<any[]>([]);

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
          const response = await axios.get(`http://localhost:5000/api/request/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });

          const usersResponse = await axios.get(`http://localhost:5000/api/task/accepts/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          setTask(response.data);
          setAcceptedUsers(usersResponse.data);

          setLoading(false);
        } catch (error) {
          if (error.response && error.response.data && error.response.data.message === 'jwt expired') {
            try {
              const refreshResponse = await axios.post('http://localhost:5000/refreshtoken', { token });
              const newToken = refreshResponse.data.token;
              localStorage.setItem('authToken', newToken);
              setToken(newToken);

              // 重新尝试请求
              const retryResponse = await axios.get(`http://localhost:5000/api/request/${id}`, {
                headers: {
                  Authorization: `Bearer ${newToken}`,
                }
              });
              setTask(retryResponse.data);

              const retryUsersResponse = await axios.get(`http://localhost:5000/api/task/accepts/${id}`, {
                headers: { Authorization: `Bearer ${newToken}` }
              });
              setAcceptedUsers(retryUsersResponse.data);

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

  const handleCancelClick = async () => {
    if (token) {
      try {
        await axios.delete(`http://localhost:5000/api/request/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        navigate('/home');
      } catch (error) {
        console.error('Error cancelling task:', error);
      }
    }
  };

  const handleRefreshClick = async () => {
    if (token) {
      try {
        const usersResponse = await axios.get(`http://localhost:5000/api/task/accepts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAcceptedUsers(usersResponse.data);
      } catch (error) {
        console.error('Error refreshing accepted users:', error);
      }
    }
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
        <button onClick={handleCancelClick}>Cancel Task</button>
      </div>
      <div style={{ flex: 1, background: '#ffffff', padding: '20px' }}>
        <h2>Accepted Users</h2>
        <button onClick={handleRefreshClick}>Refresh</button>
        {acceptedUsers.length > 0 ? (
          <ul>
            {acceptedUsers.map((user, index) => (
              <li key={index}>{user.user_name} - Rating: {user.user_rating}</li>
            ))}
          </ul>
        ) : (
          <p>No users have accepted this task yet.</p>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
