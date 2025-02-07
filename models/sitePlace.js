const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],  // Store image URLs from Cloudinary
  likes: { type: Number, default: 0 },
  comments: [
    {
      user: String,
      text: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  approved: { type: Boolean, default: false },
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
