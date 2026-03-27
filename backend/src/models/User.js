const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  shopType: { type: String, required: true },
  gstin: { type: String },
  subscriptionStatus: { type: String, enum: ['free', 'premium', 'pro'], default: 'free' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
