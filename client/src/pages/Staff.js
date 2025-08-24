import React, { useState, useEffect } from 'react';
import api from '../utils/axios';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'keeper'
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await api.get('/api/staff');
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
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
      if (editingStaff) {
        // For editing, don't send password if it's empty
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await api.put(`/api/staff/${editingStaff._id}`, updateData);
      } else {
        await api.post('/api/staff', formData);
      }
      fetchStaff();
      resetForm();
    } catch (error) {
      console.error('Error saving staff:', error);
      alert(error.response?.data?.message || 'Error saving staff member. Please try again.');
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      username: staffMember.username,
      email: staffMember.email,
      password: '', // Don't populate password for security
      role: staffMember.role
    });
    setShowForm(true);
  };

  const handleDelete = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await api.delete(`/api/staff/${staffId}`);
        fetchStaff();
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert(error.response?.data?.message || 'Error deleting staff member. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'keeper'
    });
    setEditingStaff(null);
    setShowForm(false);
  };

  if (loading) return <div>Loading staff...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Staff Members</h2>
        <button className="btn" onClick={() => setShowForm(true)}>Add New Staff</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Password {editingStaff && <span style={{ fontSize: '0.8rem', color: '#666' }}>(leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingStaff}
                  minLength="6"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="keeper">Keeper</option>
                  <option value="veterinarian">Veterinarian</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div>
              <button type="submit" className="btn" style={{ marginRight: '0.5rem' }}>
                {editingStaff ? 'Update Staff' : 'Add Staff'}
              </button>
              <button type="button" onClick={resetForm} className="btn" style={{ backgroundColor: '#6c757d' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {staff.length === 0 ? (
          <div className="card">
            <p>No staff members found. Add some staff to get started!</p>
          </div>
        ) : (
          staff.map(member => (
            <div key={member._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {member.avatar && (
                    <img 
                      src={member.avatar} 
                      alt="Profile" 
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '50%' 
                      }} 
                    />
                  )}
                  <div>
                    <h3>{member.username}</h3>
                    <p><strong>Email:</strong> {member.email}</p>
                    <p><strong>Role:</strong> 
                      <span style={{ 
                        color: member.role === 'admin' ? '#e74c3c' : member.role === 'veterinarian' ? '#3498db' : '#2ecc71',
                        fontWeight: 'bold',
                        marginLeft: '0.5rem'
                      }}>
                        {member.role}
                      </span>
                    </p>
                    <p><strong>Auth Provider:</strong> {member.authProvider || 'local'}</p>
                    <p><strong>Joined:</strong> {new Date(member.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <button 
                    className="btn" 
                    style={{ marginRight: '0.5rem' }}
                    onClick={() => handleEdit(member)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(member._id)}
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

export default Staff;