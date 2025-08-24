import React, { useState, useEffect } from 'react';
import api from '../utils/axios';

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    adultTickets: '',
    childTickets: '',
    totalVisitors: '',
    totalRevenue: '',
    notes: ''
  });

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await api.get('/api/visitors');
      setVisitors(response.data);
    } catch (error) {
      console.error('Error fetching visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-calculate total visitors when adult or child tickets change
      if (name === 'adultTickets' || name === 'childTickets') {
        const adults = parseInt(name === 'adultTickets' ? value : prev.adultTickets) || 0;
        const children = parseInt(name === 'childTickets' ? value : prev.childTickets) || 0;
        newData.totalVisitors = adults + children;
        
        // Auto-calculate revenue (assuming $15 adult, $10 child)
        newData.totalRevenue = (adults * 15 + children * 10).toFixed(2);
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVisitor) {
        await api.put(`/api/visitors/${editingVisitor._id}`, formData);
      } else {
        await api.post('/api/visitors', formData);
      }
      fetchVisitors();
      resetForm();
    } catch (error) {
      console.error('Error saving visitor record:', error);
      alert(error.response?.data?.message || 'Error saving visitor record. Please try again.');
    }
  };

  const handleEdit = (visitor) => {
    setEditingVisitor(visitor);
    setFormData({
      visitDate: new Date(visitor.visitDate).toISOString().split('T')[0],
      adultTickets: visitor.adultTickets,
      childTickets: visitor.childTickets,
      totalVisitors: visitor.totalVisitors,
      totalRevenue: visitor.totalRevenue,
      notes: visitor.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (visitorId) => {
    if (window.confirm('Are you sure you want to delete this visitor record?')) {
      try {
        await api.delete(`/api/visitors/${visitorId}`);
        fetchVisitors();
      } catch (error) {
        console.error('Error deleting visitor record:', error);
        alert(error.response?.data?.message || 'Error deleting visitor record. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      visitDate: new Date().toISOString().split('T')[0],
      adultTickets: '',
      childTickets: '',
      totalVisitors: '',
      totalRevenue: '',
      notes: ''
    });
    setEditingVisitor(null);
    setShowForm(false);
  };

  if (loading) return <div>Loading visitor records...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Visitor Records</h2>
        <button className="btn" onClick={() => setShowForm(true)}>Add New Record</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>{editingVisitor ? 'Edit Visitor Record' : 'Add New Visitor Record'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Visit Date</label>
                <input
                  type="date"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Adult Tickets</label>
                <input
                  type="number"
                  name="adultTickets"
                  value={formData.adultTickets}
                  onChange={handleInputChange}
                  min="0"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Child Tickets</label>
                <input
                  type="number"
                  name="childTickets"
                  value={formData.childTickets}
                  onChange={handleInputChange}
                  min="0"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Total Visitors</label>
                <input
                  type="number"
                  name="totalVisitors"
                  value={formData.totalVisitors}
                  onChange={handleInputChange}
                  required
                  min="0"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Total Revenue ($)</label>
                <input
                  type="number"
                  name="totalRevenue"
                  value={formData.totalRevenue}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <button type="submit" className="btn" style={{ marginRight: '0.5rem' }}>
                {editingVisitor ? 'Update Record' : 'Add Record'}
              </button>
              <button type="button" onClick={resetForm} className="btn" style={{ backgroundColor: '#6c757d' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {visitors.length === 0 ? (
          <div className="card">
            <p>No visitor records found. Add some records to get started!</p>
          </div>
        ) : (
          visitors.map(record => (
            <div key={record._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3>Visit Date: {new Date(record.visitDate).toLocaleDateString()}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <p><strong>Adult Tickets:</strong> {record.adultTickets}</p>
                    <p><strong>Child Tickets:</strong> {record.childTickets}</p>
                    <p><strong>Total Visitors:</strong> {record.totalVisitors}</p>
                    <p><strong>Total Revenue:</strong> ${record.totalRevenue.toFixed(2)}</p>
                  </div>
                  {record.notes && <p style={{ marginTop: '0.5rem' }}><strong>Notes:</strong> {record.notes}</p>}
                </div>
                <div>
                  <button 
                    className="btn" 
                    style={{ marginRight: '0.5rem' }}
                    onClick={() => handleEdit(record)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(record._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Visitors;