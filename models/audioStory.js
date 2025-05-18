const mongoose = require('mongoose');

const audioStorySchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  audioUrl: String,
  coverImageUrl: String,
  uploadedBy: String, // admin or user ID
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AudioStory', audioStorySchema);
