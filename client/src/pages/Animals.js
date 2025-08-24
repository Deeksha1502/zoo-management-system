import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import AuthStatus from '../components/AuthStatus';

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

  if (loading) return <div>Loading animals...</div>;

  return (
    <div>
      <AuthStatus />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Animals</h2>
        <div>
          <button 
            className="btn" 
            onClick={async () => {
              try {
                const response = await api.get('/api/animals');
                console.log('Test API call successful:', response.data.length, 'animals');
                alert(`API test successful! Found ${response.data.length} animals`);
              } catch (error) {
                console.error('Test API call failed:', error);
                alert('API test failed: ' + (error.response?.data?.message || error.message));
              }
            }}
            style={{ marginRight: '10px' }}
          >
            Test API
          </button>
          <button className="btn" onClick={() => setShowForm(true)}>Add New Animal</button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>{editingAnimal ? 'Edit Animal' : 'Add New Animal'}</h3>
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Species</label>
                <input
                  type="text"
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="mammals">Mammals</option>
                  <option value="birds">Birds</option>
                  <option value="reptiles">Reptiles</option>
                  <option value="amphibians">Amphibians</option>
                  <option value="fish">Fish</option>
                  <option value="invertebrates">Invertebrates</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="0"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Health Status</label>
                <select
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="healthy">Healthy</option>
                  <option value="sick">Sick</option>
                  <option value="injured">Injured</option>
                  <option value="quarantine">Quarantine</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Habitat</label>
                <select
                  name="habitat"
                  value={formData.habitat}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="">No Habitat Assigned</option>
                  {habitats.map(habitat => {
                    const availableSpace = habitat.capacity - habitat.currentOccupancy;
                    return (
                      <option key={habitat._id} value={habitat._id}>
                        {habitat.name} ({availableSpace} spaces available)
                      </option>
                    );
                  })}
                </select>
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
                {editingAnimal ? 'Update Animal' : 'Add Animal'}
              </button>
              <button type="button" onClick={resetForm} className="btn" style={{ backgroundColor: '#6c757d' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {animals.length === 0 ? (
          <div className="card">
            <p>No animals found. Add some animals to get started!</p>
          </div>
        ) : (
          animals.map(animal => (
            <div key={animal._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3>{animal.name}</h3>
                  <p><strong>Species:</strong> {animal.species}</p>
                  <p><strong>Category:</strong> {animal.category}</p>
                  <p><strong>Age:</strong> {animal.age} years</p>
                  <p><strong>Gender:</strong> {animal.gender}</p>
                  <p><strong>Health Status:</strong> 
                    <span style={{ 
                      color: animal.healthStatus === 'healthy' ? '#2ecc71' : '#e74c3c',
                      fontWeight: 'bold',
                      marginLeft: '0.5rem'
                    }}>
                      {animal.healthStatus}
                    </span>
                  </p>
                  <p><strong>Habitat:</strong> {animal.habitat?.name || 'Not assigned'}</p>
                  {animal.notes && <p><strong>Notes:</strong> {animal.notes}</p>}
                </div>
                <div>
                  <button 
                    className="btn" 
                    style={{ marginRight: '0.5rem' }}
                    onClick={() => handleEdit(animal)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(animal._id)}
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

export default Animals;