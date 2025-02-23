const mongoose = require("mongoose");

const glampingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  images: [{ type: String, required: true }], // Store Cloudinary URLs
  amenities: [{ type: String }], // List of amenities
});

module.exports = mongoose.model("GlampingSite", glampingSchema);
