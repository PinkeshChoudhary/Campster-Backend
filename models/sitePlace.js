const mongoose = require("mongoose");

const CampingExperienceSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // Changed from String to Number
    required: true,
  },
  groupSize: {
    type: Number,
    required: true,
  },
  tentCondition: {
    type: String,
    required: true,
    enum: ["Excellent", "Good", "Average", "Poor"],
  },
  comfort: {
    type: Number, // Changed from String to Number for consistency
    required: true,
    min: 1,
    max: 5,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  amenities: {
    type: [String], 
    default: [],
  },
  wildlife: {
    type: String, 
    default: "", // Made optional
  },
  bestPart: {
    type: String,
    required: true,
  },
  challenges: {
    type: String, 
    default: "", // Made optional
  },
  tips: {
    type: String, 
    default: "", // Made optional
  },
  images: {
    type: [String], 
    required: true,
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
    required: true 
  },
});

const CampingExperience = mongoose.model("CampingExperience", CampingExperienceSchema);
module.exports = CampingExperience;
