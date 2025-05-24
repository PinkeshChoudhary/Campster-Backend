const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  typeOfPlace:{
    type: String,
    required: true,
  },
  location: {
    type: String, 
    required: true,
  },
  influncerInstaGramProfile:{
 type: String,
    required: false,
  },
  locationCoordinates: {
    type: String, 
    required: true,
  },
  images: {
    type: [String], 
    required: true,
  },
  paid: { 
    type: Boolean, 
    default: false 
  },
  approved: { 
    type: Boolean, 
    default: false 
  },
  likes: { type: Number, default: 0 }, // Total like count
  likedBy: [{ type: String }],// Store Firebase UID of users who liked the place
  comments: [
    {
      user: String, // Store the user name or ID
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  userId: { 
    type: String, // Firebase UID for the user who submitted the experience
    required: false 
  },
});

const place = mongoose.model("place", placeSchema);
module.exports = place;
