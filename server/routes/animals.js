const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');
const { auth } = require('../middleware/auth');

// GET /api/animals - Get all animals
router.get('/', auth, async (req, res) => {
  try {
    const animals = await Animal.find()
      .populate('habitat', 'name type')
      .populate('assignedKeeper', 'username email');
    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/animals/count - Get animal count
router.get('/count', auth, async (req, res) => {
  try {
    const count = await Animal.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/animals - Create new animal
router.post('/', auth, async (req, res) => {
  try {
    const Habitat = require('../models/Habitat');
    
    // Check habitat capacity if habitat is assigned
    if (req.body.habitat) {
      const habitat = await Habitat.findById(req.body.habitat);
      if (!habitat) {
        return res.status(400).json({ message: 'Habitat not found' });
      }
      if (habitat.currentOccupancy >= habitat.capacity) {
        return res.status(400).json({ message: 'Habitat is at full capacity' });
      }
    }

    const animal = new Animal(req.body);
    const savedAnimal = await animal.save();

    // Update habitat occupancy
    if (req.body.habitat) {
      await Habitat.findByIdAndUpdate(req.body.habitat, {
        $inc: { currentOccupancy: 1 }
      });
    }

    // Return populated animal data
    const populatedAnimal = await Animal.findById(savedAnimal._id)
      .populate('habitat', 'name type')
      .populate('assignedKeeper', 'username email');

    res.status(201).json(populatedAnimal);
  } catch (error) {
    console.error('Error creating animal:', error);
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/animals/:id - Update animal
router.put('/:id', auth, async (req, res) => {
  try {
    const Habitat = require('../models/Habitat');
    const currentAnimal = await Animal.findById(req.params.id);
    
    if (!currentAnimal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    const currentHabitatId = currentAnimal.habitat?.toString();
    const newHabitatId = req.body.habitat || null;

    // Handle habitat changes
    if (currentHabitatId !== newHabitatId) {
      // If moving to a new habitat, check capacity
      if (newHabitatId) {
        const newHabitat = await Habitat.findById(newHabitatId);
        if (!newHabitat) {
          return res.status(400).json({ message: 'New habitat not found' });
        }
        if (newHabitat.currentOccupancy >= newHabitat.capacity) {
          return res.status(400).json({ message: 'New habitat is at full capacity' });
        }
      }

      // Update habitat occupancies
      if (currentHabitatId) {
        await Habitat.findByIdAndUpdate(currentHabitatId, {
          $inc: { currentOccupancy: -1 }
        });
      }
      
      if (newHabitatId) {
        await Habitat.findByIdAndUpdate(newHabitatId, {
          $inc: { currentOccupancy: 1 }
        });
      }
    }

    const updatedAnimal = await Animal.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true 
    }).populate('habitat', 'name type').populate('assignedKeeper', 'username email');
    
    res.json(updatedAnimal);
  } catch (error) {
    console.error('Error updating animal:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/animals/:id - Delete animal
router.delete('/:id', auth, async (req, res) => {
  try {
    const Habitat = require('../models/Habitat');
    const animal = await Animal.findById(req.params.id);
    
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    // Update habitat occupancy
    if (animal.habitat) {
      await Habitat.findByIdAndUpdate(animal.habitat, {
        $inc: { currentOccupancy: -1 }
      });
    }

    await Animal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;