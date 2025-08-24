import React, { useState, useEffect } from 'react';
import api from '../utils/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAnimals: 0,
    totalHabitats: 0,
    totalStaff: 0,
    recentVisitors: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [animals, habitats, staff, visitors] = await Promise.all([
        api.get('/api/animals/count'),
        api.get('/api/habitats/count'),
        api.get('/api/staff/count'),
        api.get('/api/visitors/recent')
      ]);

      setStats({
        totalAnimals: animals.data.count || 0,
        totalHabitats: habitats.data.count || 0,
        totalStaff: staff.data.count || 0,
        recentVisitors: visitors.data.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div className="card">
          <h3>🐾 Total Animals</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>{stats.totalAnimals}</p>
        </div>
        <div className="card">
          <h3>🏠 Total Habitats</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2ecc71' }}>{stats.totalHabitats}</p>
        </div>
        <div className="card">
          <h3>👥 Staff Members</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e67e22' }}>{stats.totalStaff}</p>
        </div>
        <div className="card">
          <h3>🎫 Recent Visitors</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9b59b6' }}>{stats.recentVisitors}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;