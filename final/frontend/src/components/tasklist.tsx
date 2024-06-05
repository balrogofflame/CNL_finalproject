import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './tasklist.css';

function getDistanceBetweenPoints(latitude1, longitude1, latitude2, longitude2, unit = 'kilometers') {
  let theta = longitude1 - longitude2;
  let distance = 60 * 1.1515 * (180/Math.PI) * Math.acos(
      Math.sin(latitude1 * (Math.PI/180)) * Math.sin(latitude2 * (Math.PI/180)) + 
      Math.cos(latitude1 * (Math.PI/180)) * Math.cos(latitude2 * (Math.PI/180)) * Math.cos(theta * (Math.PI/180))
  );
  if (unit === 'miles') {
      return distance.toFixed(2);
  } else if (unit === 'kilometers') {
      return (distance * 1.609344).toFixed(2);
  }
}

// 定义任务类型
interface Task {
  seeker_uid: string;
  quest_name: string;
  quest_description: string;
  quest_location: string;
  quest_logitude: number;
  quest_latitude: number;
  quest_reward: string;
  quest_reward_type: string;
  quest_end_time: string;
  quest_id: string;
  user_name: string;
  user_rating: string;
}

interface TaskListProps {
  userId: string; // 从 Home 组件传递过来的 userId
  helperLongitude: number;
  helperLatitude: number;
}


const TaskList: React.FC<TaskListProps> = ({ userId, helperLongitude, helperLatitude }) => {
  const navigate = useNavigate();
  const [sortMethod, setSortMethod] = useState('newToOld');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>(`http://localhost:5000/api/${userId}/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortMethod(e.target.value);
  };

  const getSortedTasks = (): Task[] => {
    const sortedTasks = [...tasks]; // 创建任务的副本以避免直接修改状态
    return sortedTasks.sort((a, b) => {
      const dateA = new Date(a.quest_end_time).getTime();
      const dateB = new Date(b.quest_end_time).getTime();
      const distA = Number(getDistanceBetweenPoints(a.quest_latitude, a.quest_logitude, helperLatitude, helperLongitude));
      const distB = Number(getDistanceBetweenPoints(b.quest_latitude, b.quest_logitude, helperLatitude, helperLongitude));
      const ratingA = parseFloat(a.user_rating);
      const ratingB = parseFloat(b.user_rating);

      if (sortMethod === 'newToOld') {
        return dateB - dateA;
      } 
      else if (sortMethod === 'oldToNew') {
        return dateA - dateB;
      }
      else if (sortMethod === 'nearToFar'){
        return distA - distB;
      }
      else if (sortMethod === 'farToNear'){
        return distB - distA;
      }
      else if (sortMethod === 'rate_highToLow'){
        return ratingB - ratingA;
      }
      else if (sortMethod === 'rate_lowToHigh'){
        return ratingA - ratingB;
      }
      return 0; // 如果没有匹配到排序方法，则返回 0 表示不排序
    });
  };

  const sortedTasks = getSortedTasks();

  const handleProfileClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation(); // Prevent the event from bubbling up to the task click handler
    navigate(`/profile/${userId}`);
  };

  const handleAcceptTaskClick = async (e: React.MouseEvent, taskId: string, dist: number) => {
    e.stopPropagation(); // Prevent the event from bubbling up to the task click handler
      // 調用後端接口接受任務
      
      try {
        // 調用後端接口接受任務
        await axios.post(`http://localhost:5000/api/accept-task/${taskId}`, { userId, dist });
        console.log(`Task ${taskId} accepted`);
    
        // 跳轉到特定的頁面，例如到任務詳情頁面
        navigate(`/task-accepts/${userId}/${taskId}`);
      } catch (error) {
        console.error('Error accepting task:', error);
        alert('Failed to accept task: ' + (error.response?.data.message || error.message));
      }
      // 跳轉到特定的頁面，例如到任務詳情頁面
    
    // Add your task acceptance logic here
  };

  const handleReportTaskClick = async (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation(); // Prevent the event from bubbling up to the task click handler
    console.log(taskId);
    try {
      const response = await axios.post('http://localhost:5000/api/report', { taskId, userId });
      console.log(`Task ${taskId} reported`);
      console.log(response.data.message); // 显示服务器返回的信息
    } catch (error) {
      console.error('Error reporting task:', error);
    }
  };

  return (
    <div className="task-list">
      <h2>Sent Tasks</h2>
      <div className="sort-by">
        <label htmlFor="sort">Sort by:</label>
        <select id="sort" value={sortMethod} onChange={handleSortChange}>
          <option value="newToOld">New to Old</option>
          <option value="oldToNew">Old to New</option>
          <option value="nearToFar">Near to Far</option>
          <option value="farToNear">Far to Near</option>
          <option value="rate_highToLow">Highest User Rating</option>
          <option value="rate_lowToHigh">Lowest User Rating</option>
        </select>
      </div>
      {sortedTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {sortedTasks.map((task) => (
            <li key={task.quest_id}>
              <h3>{task.quest_name}</h3>
              <p className="task-details">{task.quest_description}</p>
              <p className="task-details"><strong>Location:</strong> {task.quest_location}</p>
              <p className="task-details"><strong>Longitude:</strong> {task.quest_logitude}</p>
              <p className="task-details"><strong>Latitude:</strong> {task.quest_latitude}</p>
              <p className="task-details"><strong>Distance:</strong> {getDistanceBetweenPoints(task.quest_latitude, task.quest_logitude, helperLatitude, helperLongitude)}</p>
              <p className="task-details"><strong>Reward:</strong> {task.quest_reward} ({task.quest_reward_type})</p>
              <p className="task-details"><strong>End Time:</strong> {new Date(task.quest_end_time).toLocaleString()}</p>
              <p className="task-details"><strong>Username:</strong> {task.user_name}</p>
              <p className="task-details"><strong>User Rating:</strong> {task.user_rating}</p>
              <div className="task-buttons">
                <button onClick={(e) => handleProfileClick(e, task.seeker_uid)}>View Profile</button>
                <button onClick={(e) => handleAcceptTaskClick(e, task.quest_id, Number(getDistanceBetweenPoints(task.quest_latitude, task.quest_logitude, helperLatitude, helperLongitude)))}>Accept Task</button>
                <button onClick={(e) => handleReportTaskClick(e, task.quest_id)}>Report Task</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
