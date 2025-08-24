import React, { useState, useEffect } from 'react';
import api from '../utils/axios';

const Habitats = () => {
  const [habitats, setHabitats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHabitat, setEditingHabitat] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    description: ''
  });

  useEffect(() => {
    fetchHabitats();
  }, []);

  const fetchHabitats = async () => {
    try {
      const response = await api.get('/api/habitats');
      setHabitats(response.data);
    } catch (error) {
      console.error('Error fetching habitats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHabitat) {
        await api.put(`/api/habitats/${editingHabitat._id}`, formData);
      } else {
        await api.post('/api/habitats', formData);
      }
      fetchHabitats();
      resetForm();
    } catch (error) {
      console.error('Error saving habitat:', error);
      alert(error.response?.data?.message || 'Error saving habitat. Please try again.');
    }
  };

  const handleEdit = (habitat) => {
    setEditingHabitat(habitat);
    setFormData({
      name: habitat.name,
      type: habitat.type,
      capacity: habitat.capacity,
      description: habitat.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (habitatId) => {
    if (window.confirm('Are you sure you want to delete this habitat?')) {
      try {
        await api.delete(`/api/habitats/${habitatId}`);
        fetchHabitats();
      } catch (error) {
        console.error('Error deleting habitat:', error);
        alert(error.response?.data?.message || 'Error deleting habitat. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      capacity: '',
      description: ''
    });
    setEditingHabitat(null);
    setShowForm(false);
  };

  if (loading) return <div>Loading habitats...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Habitats</h2>
        <button className="btn" onClick={() => setShowForm(true)}>Add New Habitat</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>{editingHabitat ? 'Edit Habitat' : 'Add New Habitat'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Type</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., indoor, outdoor"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <button type="submit" className="btn" style={{ marginRight: '0.5rem' }}>
                {editingHabitat ? 'Update Habitat' : 'Add Habitat'}
              </button>
              <button type="button" onClick={resetForm} className="btn" style={{ backgroundColor: '#6c757d' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {habitats.length === 0 ? (
          <div className="card">
            <p>No habitats found. Add some habitats to get started!</p>
          </div>
        ) : (
          habitats.map(habitat => (
            <div key={habitat._id} className="card">
              <h3>{habitat.name}</h3>
              <p><strong>Type:</strong> {habitat.type}</p>
              <p><strong>Capacity:</strong> {habitat.capacity}</p>
              <p><strong>Current Occupancy:</strong> {habitat.currentOccupancy}</p>
              <p><strong>Available Space:</strong> {habitat.capacity - habitat.currentOccupancy}</p>
              {habitat.description && <p><strong>Description:</strong> {habitat.description}</p>}
              <div style={{ marginTop: '1rem' }}>
                <button 
                  className="btn" 
                  style={{ marginRight: '0.5rem' }}
                  onClick={() => handleEdit(habitat)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(habitat._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Habitats;