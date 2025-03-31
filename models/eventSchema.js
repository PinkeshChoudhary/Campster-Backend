const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  organizer: { 
    type: String, // Firebase UID for the user who submitted the event
    required: false 
  },
  ticketType:  {
    type: String,
    enum: ['free', 'paid'],
    required: true
  },
  price: {
    type: Number,
    required: false
  },

  images: [{ type: String, required: true }],
  category: {
    type: String,
    enum: ['Music', 'Sports', 'Conference', 'Workshop', 'Festival', 'Other'],
    required: true
  },
  totalTickets: {
    type: Number,
    required: true
  },
  availableTickets: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
