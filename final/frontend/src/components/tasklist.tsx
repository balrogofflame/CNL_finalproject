import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './tasklist.css';

// 定义任务类型
interface Task {
  seeker_uid: string;
  quest_name: string;
  quest_description: string;
  quest_location: string;
  quest_reward: string;
  quest_reward_type: string;
  quest_end_time: string;
  quest_id: string;
  user_name: string;
  user_rating: string;
}

interface TaskListProps {
  userId: string; // 从 Home 组件传递过来的 userId
}


const TaskList: React.FC<TaskListProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [sortMethod, setSortMethod] = useState('newToOld');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>('http://localhost:5000/api/tasks');
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
      if (sortMethod === 'newToOld') {
        return dateB - dateA;
      } else if (sortMethod === 'oldToNew') {
        return dateA - dateB;
      }
      return 0; // 如果没有匹配到排序方法，则返回 0 表示不排序
    });
  };

  const sortedTasks = getSortedTasks();

  const handleProfileClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation(); // Prevent the event from bubbling up to the task click handler
    navigate(`/profile/${userId}`);
  };

  const handleAcceptTaskClick = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation(); // Prevent the event from bubbling up to the task click handler
    console.log(`Task ${taskId} accepted`);
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
              <p className="task-details"><strong>Position:</strong> {task.quest_location}</p>
              <p className="task-details"><strong>Reward:</strong> {task.quest_reward} ({task.quest_reward_type})</p>
              <p className="task-details"><strong>End Time:</strong> {new Date(task.quest_end_time).toLocaleString()}</p>
              <p className="task-details"><strong>Username:</strong> {task.user_name}</p>
              <p className="task-details"><strong>User Rating:</strong> {task.user_rating}</p>
              <div className="task-buttons">
                <button onClick={(e) => handleProfileClick(e, task.seeker_uid)}>View Profile</button>
                <button onClick={(e) => handleAcceptTaskClick(e, task.seeker_uid)}>Accept Task</button>
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
