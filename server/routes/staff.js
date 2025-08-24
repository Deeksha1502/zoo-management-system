const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

// GET /api/staff - Get all staff members
router.get('/', auth, async (req, res) => {
  try {
    const staff = await User.find().select('-password');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/staff/count - Get staff count
router.get('/count', auth, async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/staff - Create new staff member
router.post('/', auth, async (req, res) => {
  try {
    // Check if current user is admin or if it's the first user (auto-admin)
    const userCount = await User.countDocuments();
    if (userCount > 0 && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const user = new User(req.body);
    const savedUser = await user.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/staff/:id - Update staff member
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if current user is admin or updating their own profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Admin access required or can only update own profile' });
    }

    // Don't allow non-admins to change roles
    if (req.user.role !== 'admin' && req.body.role) {
      delete req.body.role;
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/staff/:id - Delete staff member (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;