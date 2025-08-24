import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthStatus = () => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('token');

  if (loading) {
    return <div>Loading auth status...</div>;
  }

  return (
    <div style={{ 
      padding: '10px', 
      backgroundColor: user ? '#d4edda' : '#f8d7da', 
      border: `1px solid ${user ? '#c3e6cb' : '#f5c6cb'}`,
      borderRadius: '4px',
      marginBottom: '10px'
    }}>
      <strong>Auth Status:</strong>
      {user ? (
        <span style={{ color: '#155724' }}>
          ✅ Logged in as {user.username} ({user.role})
        </span>
      ) : (
        <span style={{ color: '#721c24' }}>
          ❌ Not logged in
        </span>
      )}
      <br />
      <small>Token: {token ? `${token.substring(0, 20)}...` : 'None'}</small>
    </div>
  );
};

export default AuthStatus;