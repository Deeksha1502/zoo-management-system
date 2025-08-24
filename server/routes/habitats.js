const express = require('express');
const router = express.Router();
const Habitat = require('../models/Habitat');
const { auth } = require('../middleware/auth');

// GET /api/habitats - Get all habitats
router.get('/', auth, async (req, res) => {
  try {
    const habitats = await Habitat.find().populate('assignedStaff', 'username email role');
    res.json(habitats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/habitats/count - Get habitat count
router.get('/count', auth, async (req, res) => {
  try {
    const count = await Habitat.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/habitats - Create new habitat
router.post('/', auth, async (req, res) => {
  try {
    const habitat = new Habitat(req.body);
    const savedHabitat = await habitat.save();
    res.status(201).json(savedHabitat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/habitats/:id - Update habitat
router.put('/:id', auth, async (req, res) => {
  try {
    const habitat = await Habitat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!habitat) {
      return res.status(404).json({ message: 'Habitat not found' });
    }
    res.json(habitat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/habitats/:id - Delete habitat
router.delete('/:id', auth, async (req, res) => {
  try {
    const habitat = await Habitat.findByIdAndDelete(req.params.id);
    if (!habitat) {
      return res.status(404).json({ message: 'Habitat not found' });
    }
    res.json({ message: 'Habitat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;