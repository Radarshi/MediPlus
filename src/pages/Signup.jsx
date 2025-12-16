// src/pages/Signup.jsx
import React from 'react';
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = async (form) => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/signup', { // ✅ FIXED URL
        method: 'POST',
        credentials: 'include', // ✅ ADDED - Send cookies
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || 'Signup failed');
        return;
      }
      
      // Store token in localStorage as backup
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Navigate to home or dashboard
      navigate('/');
      
    } catch (err) {
      console.error('Signup error:', err);
      alert('Signup failed. Please try again.');
    }
  };

  return <AuthForm type="signup" onSubmit={handleSignup} />;
}