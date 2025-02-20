const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  phone: { type: Number, required: false, unique: true }, // Admin phone
});

module.exports = mongoose.model('AdminFire', adminSchema);
