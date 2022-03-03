import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './Login.jsx';
import Home from './home.jsx';
import Register from './register';
import Welcome from './welcome';
import Test from './test';
import { useNavigate } from 'react-router-dom';

function App() {
  const [token, setToken] = useState(window.localStorage.getItem('token'));
  const [username, setUserName] = useState('');
  const navigate = useNavigate();

  const LoginSuccess = (details, username) => {
    setUserName(username);
    setToken({ details });
    window.localStorage.setItem('token', details);
  };

  const LogoutSuccess = () => {
    setToken('');
    window.localStorage.setItem('token', '');
  };

  useEffect(() => {
    if (token) {
      navigate('/welcome');
    } else navigate('/');
  }, [token]);

  return (
    <Routes>
      <Route path="/" />
      <Route element={<LoginForm LoginSuccess={LoginSuccess} />} path="login" />
      <Route element={<Home />} index />
      <Route element={<Register />} path="register" />
      {token && (
        <Route
          element={
            <Welcome Username={username} LogoutSuccess={LogoutSuccess} />
          }
          path="welcome"
        />
      )}
      <Route
        path="*"
        element={<Navigate to={token ? '/welcome' : '/login'} />}
      />
    </Routes>
  );
}

export default App;
