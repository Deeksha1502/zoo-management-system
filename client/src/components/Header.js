import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <h1>🦁 Zoo Management System</h1>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/animals">Animals</Link></li>
            <li><Link to="/habitats">Habitats</Link></li>
            <li><Link to="/staff">Staff</Link></li>
            <li><Link to="/visitors">Visitors</Link></li>
          </ul>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {user.avatar && (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%' 
                      }} 
                    />
                  )}
                  <span>{user.username}</span>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    backgroundColor: '#34495e', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '12px' 
                  }}>
                    {user.role}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  style={{
                    background: 'transparent',
                    border: '1px solid white',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" style={{ 
                background: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                textDecoration: 'none'
              }}>
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;