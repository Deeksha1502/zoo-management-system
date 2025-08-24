import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const Animals = () => {
  const { user } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [habitats, setHabitats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    category: 'mammals',
    age: '',
    gender: 'unknown',
    healthStatus: 'healthy',
    habitat: '',
    notes: ''
  });

  useEffect(() => {
    fetchAnimals();
    fetchHabitats();
  }, []);

  const fetchAnimals = async () => {
    try {
      console.log('Fetching animals...');
      const response = await api.get('/api/animals');
      console.log('Animals fetched:', response.data);
      setAnimals(response.data);
    } catch (error) {
      console.error('Error fetching animals:', error);
      console.error('Error details:', error.response?.data);
      if (error.response?.status === 401) {
        alert('Please log in again');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHabitats = async () => {
    try {
      console.log('Fetching habitats...');
      const response = await api.get('/api/habitats');
      console.log('Habitats fetched:', response.data);
      setHabitats(response.data);
    } catch (error) {
      console.error('Error fetching habitats:', error);
      console.error('Error details:', error.response?.data);
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
    
    // Validate required fields
    if (!formData.name || !formData.species) {
      alert('Name and species are required');
      return;
    }
    
    try {
      console.log('Submitting animal data:', formData);
      
      // Clean up form data
      const submitData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        habitat: formData.habitat || undefined
      };
      
      // Remove empty values
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === undefined) {
          delete submitData[key];
        }
      });
      
      console.log('Cleaned submit data:', submitData);
      
      let response;
      if (editingAnimal) {
        console.log('Updating animal with ID:', editingAnimal._id);
        response = await api.put(`/api/animals/${editingAnimal._id}`, submitData);
      } else {
        console.log('Creating new animal');
        response = await api.post('/api/animals', submitData);
      }
      
      console.log('Animal saved successfully:', response.data);
      await fetchAnimals();
      await fetchHabitats(); // Refresh habitats to update occupancy
      resetForm();
      alert(editingAnimal ? 'Animal updated successfully!' : 'Animal created successfully!');
    } catch (error) {
      console.error('Error saving animal:', error);
      console.error('Error details:', error.response?.data);
      alert(error.response?.data?.message || 'Error saving animal. Please try again.');
    }
  };

  const handleEdit = (animal) => {
    setEditingAnimal(animal);
    setFormData({
      name: animal.name,
      species: animal.species,
      category: animal.category,
      age: animal.age || '',
      gender: animal.gender,
      healthStatus: animal.healthStatus,
      habitat: animal.habitat?._id || '',
      notes: animal.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (animalId) => {
    if (window.confirm('Are you sure you want to delete this animal?')) {
      try {
        await api.delete(`/api/animals/${animalId}`);
        fetchAnimals();
      } catch (error) {
        console.error('Error deleting animal:', error);
        alert(error.response?.data?.message || 'Error deleting animal. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      species: '',
      category: 'mammals',
      age: '',
      gender: 'unknown',
      healthStatus: 'healthy',
      habitat: '',
      notes: ''
    });
    setEditingAnimal(null);
    setShowForm(false);
  };

  if (loading) return (
    <div className="loading">
      Loading animals...
    </div>
  );

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Animal Management</h1>
        <div className="page-actions">
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--primary-200)',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--primary-700)'
          }}>
            Total Animals: {animals.length}
          </div>
          <button className="btn btn-lg" onClick={() => setShowForm(true)}>
            Add New Animal
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '3rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid var(--gray-100)'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              {editingAnimal ? '✏️' : '🐾'}
            </div>
            <div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: 'var(--gray-900)',
                marginBottom: '0.25rem'
              }}>
                {editingAnimal ? 'Edit Animal' : 'Add New Animal'}
              </h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                {editingAnimal ? 'Update animal information' : 'Enter details for the new animal'}
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">🏷️ Animal Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter animal name"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">🧬 Species</label>
                <input
                  type="text"
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="e.g., African Lion, Bengal Tiger"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">📂 Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="mammals">🦁 Mammals</option>
                  <option value="birds">🦅 Birds</option>
                  <option value="reptiles">🦎 Reptiles</option>
                  <option value="amphibians">🐸 Amphibians</option>
                  <option value="fish">🐠 Fish</option>
                  <option value="invertebrates">🦋 Invertebrates</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">🎂 Age (years)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="0"
                  className="form-input"
                  placeholder="Age in years"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">⚧️ Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="male">♂️ Male</option>
                  <option value="female">♀️ Female</option>
                  <option value="unknown">❓ Unknown</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">🏥 Health Status</label>
                <select
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="healthy">✅ Healthy</option>
                  <option value="sick">🤒 Sick</option>
                  <option value="injured">🩹 Injured</option>
                  <option value="quarantine">🔒 Quarantine</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">🏠 Habitat Assignment</label>
                <select
                  name="habitat"
                  value={formData.habitat}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">🚫 No Habitat Assigned</option>
                  {habitats.map(habitat => {
                    const availableSpace = habitat.capacity - habitat.currentOccupancy;
                    return (
                      <option key={habitat._id} value={habitat._id}>
                        🏞️ {habitat.name} ({availableSpace} spaces available)
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">📝 Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Any additional information about the animal..."
                rows="4"
              />
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--gray-200)'
            }}>
              <button type="submit" className="btn btn-lg">
                {editingAnimal ? 'Update Animal' : 'Add Animal'}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary btn-lg">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1">
        {animals.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">🦁</div>
              <h3 className="empty-state-title">No Animals Yet</h3>
              <p className="empty-state-description">
                Start building your zoo by adding your first animal. Click the "Add New Animal" button above to get started.
              </p>
              <button className="btn btn-lg" onClick={() => setShowForm(true)}>
                Add Your First Animal
              </button>
            </div>
          </div>
        ) : (
          animals.map(animal => {
            const getCategoryIcon = (category) => {
              const icons = {
                mammals: '🦁',
                birds: '🦅', 
                reptiles: '🦎',
                amphibians: '🐸',
                fish: '🐠',
                invertebrates: '🦋'
              };
              return icons[category] || '🐾';
            };

            const getGenderIcon = (gender) => {
              const icons = {
                male: '♂️',
                female: '♀️',
                unknown: '❓'
              };
              return icons[gender] || '❓';
            };

            const getHealthStatusClass = (status) => {
              const classes = {
                healthy: 'status-healthy',
                sick: 'status-sick',
                injured: 'status-injured',
                quarantine: 'status-quarantine'
              };
              return classes[status] || 'status-healthy';
            };

            return (
              <div key={animal._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        background: 'linear-gradient(135deg, var(--primary-100) 0%, var(--primary-200) 100%)',
                        borderRadius: 'var(--radius-xl)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        border: '2px solid var(--primary-300)'
                      }}>
                        {getCategoryIcon(animal.category)}
                      </div>
                      <div>
                        <h3 style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: '700', 
                          color: 'var(--gray-900)',
                          marginBottom: '0.25rem'
                        }}>
                          {animal.name}
                        </h3>
                        <p style={{ 
                          color: 'var(--gray-600)', 
                          fontSize: '1rem',
                          fontWeight: '500'
                        }}>
                          {animal.species}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '1rem',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{ 
                        background: 'var(--gray-50)', 
                        padding: '1rem', 
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--gray-200)'
                      }}>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '600', 
                          color: 'var(--gray-500)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '0.25rem'
                        }}>
                          Category
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '600', 
                          color: 'var(--gray-900)',
                          textTransform: 'capitalize'
                        }}>
                          {getCategoryIcon(animal.category)} {animal.category}
                        </div>
                      </div>
                      
                      <div style={{ 
                        background: 'var(--gray-50)', 
                        padding: '1rem', 
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--gray-200)'
                      }}>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '600', 
                          color: 'var(--gray-500)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '0.25rem'
                        }}>
                          Age & Gender
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '600', 
                          color: 'var(--gray-900)'
                        }}>
                          {animal.age ? `${animal.age} years` : 'Unknown age'} • {getGenderIcon(animal.gender)} {animal.gender}
                        </div>
                      </div>
                      
                      <div style={{ 
                        background: 'var(--gray-50)', 
                        padding: '1rem', 
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--gray-200)'
                      }}>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '600', 
                          color: 'var(--gray-500)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '0.25rem'
                        }}>
                          Health Status
                        </div>
                        <span className={`status-badge ${getHealthStatusClass(animal.healthStatus)}`}>
                          {animal.healthStatus}
                        </span>
                      </div>
                      
                      <div style={{ 
                        background: 'var(--gray-50)', 
                        padding: '1rem', 
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--gray-200)'
                      }}>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '600', 
                          color: 'var(--gray-500)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '0.25rem'
                        }}>
                          Habitat
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '600', 
                          color: animal.habitat ? 'var(--gray-900)' : 'var(--gray-500)'
                        }}>
                          {animal.habitat ? `🏞️ ${animal.habitat.name}` : '🚫 Not assigned'}
                        </div>
                      </div>
                    </div>
                    
                    {animal.notes && (
                      <div style={{ 
                        background: 'var(--primary-50)', 
                        padding: '1rem', 
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--primary-200)',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '600', 
                          color: 'var(--primary-600)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '0.5rem'
                        }}>
                          📝 Notes
                        </div>
                        <p style={{ 
                          color: 'var(--primary-700)', 
                          fontSize: '0.875rem',
                          lineHeight: '1.5',
                          margin: 0
                        }}>
                          {animal.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.75rem',
                    minWidth: '120px'
                  }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(animal)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(animal._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Animals;