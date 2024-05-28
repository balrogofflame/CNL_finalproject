import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './tasklist.css';

const TaskList = () => {
  const navigate = useNavigate();
  const [sortMethod, setSortMethod] = useState('newToOld');

  // Mock data for tasks
  const tasks = [
    {
      id: 1,
      name: 'Buy Groceries',
      description: 'Need someone to buy groceries for me',
      position: 'Taipei',
      reward: '100',
      selectedOption: 'money',
      endTime: new Date('2024-05-30T10:00:00').toISOString(),
      userId: 'user1'
    },
    {
      id: 2,
      name: 'Fix Laptop',
      description: 'Looking for someone to fix my laptop',
      position: 'New Taipei',
      reward: 'Dinner',
      selectedOption: 'food',
      endTime: new Date('2024-05-29T15:00:00').toISOString(),
      userId: 'user2'
    },
    {
      id: 3,
      name: 'Help with Homework',
      description: 'Need help with math homework',
      position: 'Taichung',
      reward: '50',
      selectedOption: 'money',
      endTime: new Date('2024-05-28T12:00:00').toISOString(),
      userId: 'user3'
    }
  ];

  const handleSortChange = (e) => {
    setSortMethod(e.target.value);
  };

  const getSortedTasks = () => {
    switch (sortMethod) {
      case 'newToOld':
        return tasks.sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime());
      case 'oldToNew':
        return tasks.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
      default:
        return tasks;
    }
  };

  const sortedTasks = getSortedTasks();

  const handleProfileClick = (e, userId: string) => {
    e.stopPropagation(); // Prevent the event from bubbling up to the task click handler
    navigate(`/profile/${userId}`);
  };

  const handleAcceptTaskClick = (e, taskId: number) => {
    e.stopPropagation(); // Prevent the event from bubbling up to the task click handler
    console.log(`Task ${taskId} accepted`);
    // Add your task acceptance logic here
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
            <li key={task.id}>
              <h3>{task.name}</h3>
              <p className="task-details">{task.description}</p>
              <p className="task-details"><strong>Position:</strong> {task.position}</p>
              <p className="task-details"><strong>Reward:</strong> {task.reward} ({task.selectedOption})</p>
              <p className="task-details"><strong>End Time:</strong> {new Date(task.endTime).toLocaleString()}</p>
              <div className="task-buttons">
                <button onClick={(e) => handleProfileClick(e, task.userId)}>View Profile</button>
                <button onClick={(e) => handleAcceptTaskClick(e, task.id)}>Accept Task</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
