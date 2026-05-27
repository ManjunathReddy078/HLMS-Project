const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  role: { type: String, enum: ['admin', 'supervisor', 'worker'], required: true },
  title: { type: String, required: true },
  pin: { type: String, required: true }, // Storing plain pin for quick prototype, can be hashed
  gender: { type: String }
});

module.exports = mongoose.model('User', UserSchema);
