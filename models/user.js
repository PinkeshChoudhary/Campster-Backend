const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: String, // Firebase UID as MongoDB _id
  name: String,
  dob: Date,
  email: String,
  phone: String,
});

User = mongoose.model('User', userSchema);
 module.exports = User;
