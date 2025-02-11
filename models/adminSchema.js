// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin schema
const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: true }, // Ensures that only admins have this role
  },
  { timestamps: true }
);

// // Hash password before saving the admin
// adminSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Compare provided password with hashed password in DB
// adminSchema.methods.comparePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

// Create Admin model
const Admin = mongoose.model('Admin', adminSchema);

// Hardcode admin user if not exists
(async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({ email: 'admin@example.com', password: hashedPassword });
      console.log('Default admin created');
    }
  } catch (error) {
    console.error('Error checking/creating admin:', error);
  }
})();

module.exports = Admin;
