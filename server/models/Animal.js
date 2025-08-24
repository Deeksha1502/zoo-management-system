const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  species: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    required: true,
    enum: ['mammals', 'birds', 'reptiles', 'amphibians', 'fish', 'invertebrates']
  },
  age: {
    type: Number,
    min: 0
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    default: 'unknown'
  },
  healthStatus: {
    type: String,
    enum: ['healthy', 'sick', 'injured', 'quarantine'],
    default: 'healthy'
  },
  habitat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habitat'
  },
  assignedKeeper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  arrivalDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Animal', animalSchema);