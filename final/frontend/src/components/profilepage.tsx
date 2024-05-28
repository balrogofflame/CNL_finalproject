import React from 'react';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();

  // Log the userId to ensure we are receiving it correctly
  console.log('Received userId:', userId);

  // Mock data for user profiles
  const users: Record<string, { name: string; email: string; description: string }> = {
    user1: { name: 'Alice', email: 'alice@example.com', description: 'Grocery shopper' },
    user2: { name: 'Bob', email: 'bob@example.com', description: 'Laptop repair expert' },
    user3: { name: 'Charlie', email: 'charlie@example.com', description: 'Math tutor' }
  };

  if (!userId || !users[userId]) {
    console.log('User not found');
    return <div>User not found.</div>;
  }

  const user = users[userId];

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>{user.description}</p>
    </div>
  );
};

export default ProfilePage;
