const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  userId: {
    type: String,  // Firebase UID or your user ID
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

const cityChatSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  userId: {
    type: String,  // Firebase UID or user ID
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  replies: [replySchema],  // Array of flat replies
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model('CityChat', cityChatSchema)
