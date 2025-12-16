// src/pages/Login.jsx
import React from 'react';
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async (form) => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', { // ✅ FIXED URL
        method: 'POST',
        credentials: 'include', // ✅ ADDED - Send cookies
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || 'Login failed');
        return;
      }
      
      // Store token in localStorage as backup
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Navigate to home or dashboard
      navigate('/');
      
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. Please try again.');
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
}