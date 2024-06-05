import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import '../styles/Login.css'; // Import the CSS file

const Login = () => {
  const { isAuthenticated, loginWithGitHub, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');  // Redirect to the home page when authenticated
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userId = urlParams.get('userId');  // Get userId from URL parameters
      if (token && userId) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);  // Save userId in localStorage
        setIsAuthenticated(true);
        navigate('/home');
        window.history.replaceState({}, document.title, window.location.pathname); // Remove token and userId from URL
      }
    }
  }, [isAuthenticated, navigate, setIsAuthenticated]);

  return (
    <div className="login-container">
      <h1>Welcome to TRIUMA!</h1>
      <h3>TRI-University Mutual Assistance</h3>
      <h2>Login</h2>
      <button onClick={loginWithGitHub}>Login with GitHub</button>
    </div>
  );
};

export default Login;
