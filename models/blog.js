const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  type: String,
  content: String, // For text or heading
});

const blogSchema = new mongoose.Schema({
  title: String,
  blocks: [blockSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Blog', blogSchema);
