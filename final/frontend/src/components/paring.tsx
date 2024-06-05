import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// 定义任务类型
interface QuestsStatus {
  quest_name: string;
  quest_description: string;
  quest_location: string;
  quest_end_time: string;
  accept_status: string;
}

interface QuestsStatusListProps {
  UID: string; // 从 Home 组件传递过来的 userId
}

// 定义任务类型
interface AcceptStatus {
    quest_id: string;
    quest_name: string;
    user_id: string;
    user_name: string;
    user_rating: number;
    distance: number;
}
  
interface AcceptStatusListProps {
    UID: string; // 从 Home 组件传递过来的 userId
}

const QuestsStatusList: React.FC<QuestsStatusListProps> = ({ UID }) => {
  const [questsStatus, setQuestsStatus] = useState<QuestsStatus[]>([]);
  
  useEffect(() => {
    const fetchQuestsStatus = async () => {
      try {
        const response = await axios.get<QuestsStatus[]>(`http://localhost:5000/api/${UID}/quests-status`);
        setQuestsStatus(response.data);
      } catch (error) {
        console.error('Error fetching questsStatus:', error);
      }
    };

    if (UID) {
        fetchQuestsStatus();
    }
  }, [UID]); // 确保在 UID 发生变化时重新获取评论数据

  return (
    <div>
      <h1>QuestsStatus for User {UID}</h1>
      {questsStatus.length === 0 ? (
        <p>No quests status found.</p>
      ) : (
        <div>
          {questsStatus.map((questStatus, index) => (
            <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <p><strong>Quest Name:</strong> {questStatus.quest_name}</p>
              <p><strong>Quest Description:</strong> {questStatus.quest_description}</p>
              <p><strong>Quest Location:</strong> {questStatus.quest_location}</p>
              <p><strong>Quest End Time:</strong> {questStatus.quest_end_time}</p>
              <p><strong>Accept Status:</strong> {questStatus.accept_status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const AcceptStatusList: React.FC<AcceptStatusListProps> = ({ UID }) => {
    const [acceptStatus, setAcceptStatus] = useState<AcceptStatus[]>([]);
    
  useEffect(() => {
    const fetchAcceptStatus = async () => {
      try {
        const response = await axios.get<AcceptStatus[]>(`http://localhost:5000/api/${UID}/accept-status`);
        setAcceptStatus(response.data);
      } catch (error) {
        console.error('Error fetching acceptStatus:', error);
      }
    };
  
    if (UID) {
        fetchAcceptStatus();
    }
  }, [UID]); // 确保在 UID 发生变化时重新获取评论数据
  
  const handleAcceptHelperClick = async (e: React.MouseEvent, seeker_uid: string, helper_uid: string, quest_id: string) => {
    e.stopPropagation(); // Prevent the event from bubbling up to the task click handler
      // 調用後端接口接受任務
      
      try {
        // 調用後端接口接受任務
        await axios.post(`http://localhost:5000/api/${seeker_uid}/accept-helper`, { helper_uid });
        console.log(`Helper accepted`);
    
      } catch (error) {
        console.error('Error accepting helper:', error);
        alert('Failed to accept helper: ' + (error.response?.data.message || error.message));
      }
      // 跳轉到特定的頁面，例如到任務詳情頁面
    
    // Add your task acceptance logic here
  };

  return (
    <div>
      <h1>AcceptStatus for User {UID}</h1>
      {acceptStatus.length === 0 ? (
        <p>No quests status found.</p>
      ) : (
        <div>
          {acceptStatus.map((acceptStatus, index) => (
            <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <p><strong>Quest Name:</strong> {acceptStatus.quest_name}</p>
              <p><strong>Helper Name:</strong> {acceptStatus.user_name}</p>
              <p><strong>Helper Rating:</strong> {acceptStatus.user_rating}</p>
              <p><strong>Distance:</strong> {acceptStatus.distance}</p>
              <button onClick={(e) => handleAcceptHelperClick(e, UID, acceptStatus.user_id, acceptStatus.quest_id)}>Accept Helper</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ParingPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
      
    // Log the userId to ensure we are receiving it correctly
    console.log('Received userId:', userId);
    
    const handleBackClick = () => {
    navigate('/');
  };
    
  return (
    <div>
      <QuestsStatusList UID={userId as string} />
      <AcceptStatusList UID={userId as string} />
      <button onClick={handleBackClick} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
      Back to homepage
      </button>
    </div>
  );
};
    
export default ParingPage;
