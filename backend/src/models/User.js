const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  phone: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  pan: { type: String },
  kycStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  shopType: { type: String, required: true },
  gstin: { type: String },
  subscriptionStatus: { type: String, enum: ['free', 'premium', 'pro'], default: 'free' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
