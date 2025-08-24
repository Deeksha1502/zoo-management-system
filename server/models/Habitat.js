const mongoose = require('mongoose');

const habitatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  currentOccupancy: {
    type: Number,
    default: 0,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  assignedStaff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Virtual for available space
habitatSchema.virtual('availableSpace').get(function() {
  return this.capacity - this.currentOccupancy;
});

// Ensure virtual fields are serialized
habitatSchema.set('toJSON', { virtuals: true });
habitatSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Habitat', habitatSchema);