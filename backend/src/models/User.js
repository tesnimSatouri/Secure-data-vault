// src/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true },
  passwordHash: { type: String, required: true },
  consent: {
    accepted: { type: Boolean, default: false },
    timestamp: { type: Date }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
