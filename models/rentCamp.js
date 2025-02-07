const mongoose = require('mongoose');

const campSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true },
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Camp', campSchema);