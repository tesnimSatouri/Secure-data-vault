// src/models/VaultItem.js
const mongoose = require('mongoose');

const VaultItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  label: { type: String },
  data: { type: String, required: true }, // will store encrypted payload (base64)
  iv: { type: String, required: true },   // iv in hex/base64
  tag: { type: String }, // auth tag if using GCM
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VaultItem', VaultItemSchema);
