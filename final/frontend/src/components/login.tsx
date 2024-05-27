import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Login = () => {
  const { isAuthenticated, loginWithGitHub, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');  // Redirect to the home page when authenticated
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if (token) {
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
        navigate('/home');
        window.history.replaceState({}, document.title, window.location.pathname); // Remove token from URL
      }
    }
  }, [isAuthenticated, navigate, setIsAuthenticated]);

  return (
    <div>
      <h1>Login</h1>
      <button onClick={loginWithGitHub}>Login with GitHub</button>
    </div>
  );
};

export default Login;
