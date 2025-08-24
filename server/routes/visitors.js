const express = require('express');
const router = express.Router();
const VisitorRecord = require('../models/VisitorRecord');
const { auth } = require('../middleware/auth');

// GET /api/visitors - Get all visitor records
router.get('/', auth, async (req, res) => {
  try {
    const visitors = await VisitorRecord.find().sort({ visitDate: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/visitors/recent - Get recent visitor count
router.get('/recent', auth, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const records = await VisitorRecord.find({
      visitDate: { $gte: thirtyDaysAgo }
    });
    
    const count = records.reduce((total, record) => total + record.totalVisitors, 0);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/visitors - Create new visitor record
router.post('/', auth, async (req, res) => {
  try {
    const visitorRecord = new VisitorRecord(req.body);
    const savedRecord = await visitorRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/visitors/:id - Update visitor record
router.put('/:id', auth, async (req, res) => {
  try {
    const record = await VisitorRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) {
      return res.status(404).json({ message: 'Visitor record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/visitors/:id - Delete visitor record
router.delete('/:id', auth, async (req, res) => {
  try {
    const record = await VisitorRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Visitor record not found' });
    }
    res.json({ message: 'Visitor record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;