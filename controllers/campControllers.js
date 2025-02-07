// controllers/campController.js
const Camp = require('../models/rentCamp');

// Get all camps
const getCamps = async (req, res) => {
  try {
    const camps = await Camp.find();
    res.json(camps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch camps' });
  }
};

// Add a new camp (Admin only)
const addCamp = async (req, res) => {
  try {
    const newCamp = new Camp(req.body);
    await newCamp.save();
    res.status(201).json(newCamp);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add camp' });
  }
};

// Update camp availability or details (Admin only)
const updateCamp = async (req, res) => {
  try {
    const updatedCamp = await Camp.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCamp);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update camp' });
  }
};

// Delete a camp (Admin only)
const deleteCamp = async (req, res) => {
  try {
    await Camp.findByIdAndDelete(req.params.id);
    res.json({ message: 'Camp deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete camp' });
  }
};

// User submits request to rent a camp
const rentCamp = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) return res.status(404).json({ error: 'Camp not found' });

    if (!camp.available) return res.status(400).json({ error: 'Camp is not available' });

    camp.renterDetails = req.body;
    camp.available = false;
    await camp.save();
    res.json(camp);
  } catch (error) {
    res.status(500).json({ error: 'Failed to rent camp' });
  }
};
module.exports = { getCamps, addCamp, updateCamp,  deleteCamp, rentCamp };