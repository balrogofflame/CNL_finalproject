import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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
      <button onClick={handleBackClick} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
      Back to homepage
      </button>
    </div>
  );
};
  
export default ParingPage;
  