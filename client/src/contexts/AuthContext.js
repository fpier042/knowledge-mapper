// client/src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserId(decoded.userId);
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await fetch('http://localhost:5002/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    }
  };

  const signup = async (username, email, password) => {
    const response = await fetch('http://localhost:5002/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUserId('');
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;