import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Login = () => {
    const { isAuthenticated, loginWithGitHub } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("gi")
        if (isAuthenticated) {
            navigate('/home');  // Redirect to the home page when authenticated
        }
    }, [isAuthenticated, navigate]);

    return (
        <div>
            <h1>Login</h1>
            <button onClick={loginWithGitHub}>Login with GitHub</button>
        </div>
    );
};

export default Login;
