const Place = require('../models/sitePlace');
const Admin = require('../models/adminSchema');
const Booking = require("../models/bookingSchema");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ✅ Admin Login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the provided password matches the hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


//  Get All Pending Places
const getPendingPlaces = async (req, res) => {
  try {
    const places = await Place.find({ approved: false });
    res.json({ places });
  } catch (error) {
    console.error('Error fetching pending places:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//  Approve a Place
const approvePlace = async (req, res) => {
  try {
    const placeId = req.params.id;
    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    place.approved = true;
    await place.save();

    res.json({ message: 'Place approved', place });
  } catch (error) {
    console.error('Error approving place:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//  Reject (Delete) a Place
const rejectPlace = async (req, res) => {
  try {
    const placeId = req.params.id;
    
    const place = await Place.findByIdAndDelete(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json({ message: 'Place rejected and deleted' });
  } catch (error) {
    console.error('Error rejecting place:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all confirmed and pending bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: { $in: ["Pending", "Confirmed"] } }).populate("tentId");

        res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
}
module.exports = { loginAdmin, getPendingPlaces, approvePlace, rejectPlace , getAllBookings};
