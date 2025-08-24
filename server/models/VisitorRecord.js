const mongoose = require('mongoose');

const visitorRecordSchema = new mongoose.Schema({
  visitDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  adultTickets: {
    type: Number,
    default: 0,
    min: 0
  },
  childTickets: {
    type: Number,
    default: 0,
    min: 0
  },
  totalVisitors: {
    type: Number,
    required: true,
    min: 0
  },
  totalRevenue: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Virtual for calculating total visitors
visitorRecordSchema.virtual('calculatedTotal').get(function() {
  return this.adultTickets + this.childTickets;
});

module.exports = mongoose.model('VisitorRecord', visitorRecordSchema);