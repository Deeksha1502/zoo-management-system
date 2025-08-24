import React, { useState } from 'react';
import api from '../utils/axios';

const ApiTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      // Test health endpoint
      const health = await api.get('/api/health');
      setResult(prev => prev + '\n✅ Health: ' + JSON.stringify(health.data));
      
      // Test animals endpoint
      const animals = await api.get('/api/animals');
      setResult(prev => prev + '\n✅ Animals: ' + animals.data.length + ' found');
      
      // Test habitats endpoint
      const habitats = await api.get('/api/habitats');
      setResult(prev => prev + '\n✅ Habitats: ' + habitats.data.length + ' found');
      
    } catch (error) {
      setResult(prev => prev + '\n❌ Error: ' + (error.response?.data?.message || error.message));
      console.error('API Test Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>API Test</h3>
      <button onClick={testApi} disabled={loading} className="btn">
        {loading ? 'Testing...' : 'Test API'}
      </button>
      <pre style={{ 
        marginTop: '10px', 
        padding: '10px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '4px',
        whiteSpace: 'pre-wrap',
        fontSize: '12px'
      }}>
        {result}
      </pre>
    </div>
  );
};

export default ApiTest;