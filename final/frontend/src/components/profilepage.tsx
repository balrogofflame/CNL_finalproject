import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// 定义任务类型
interface Comment {
  quest_id: string;
  comment_role: string;
  comment_content: string;
  comment_rating: number; 
}

interface CommentListProps {
  UID: string; // 从 Home 组件传递过来的 userId
}

const CommentList: React.FC<CommentListProps> = ({ UID }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get<Comment[]>(`http://localhost:5000/api/${UID}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (UID) {
      fetchComments();
    }
  }, [UID]); // 确保在 UID 发生变化时重新获取评论数据

  return (
    <div>
      <h1>Comments for User {UID}</h1>
      {comments.length === 0 ? (
        <p>No comments found.</p>
      ) : (
        <div>
          {comments.map((comment, index) => (
            <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <p><strong>Quest ID:</strong> {comment.quest_id}</p>
              <p><strong>Role:</strong> {comment.comment_role}</p>
              <p><strong>Content:</strong> {comment.comment_content}</p>
              <p><strong>Rating:</strong> {comment.comment_rating}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  // Log the userId to ensure we are receiving it correctly
  console.log('Received userId:', userId);

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div>
      <CommentList UID={userId as string} />
      <button onClick={handleBackClick} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
        Back to homepage
      </button>
    </div>
  );
};

export default ProfilePage;
