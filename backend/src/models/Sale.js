const mongoose = require('mongoose');

const SaleItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true }
});

const SaleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String },
  customerPhone: { type: String },
  items: [SaleItemSchema],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'upi', 'card'], default: 'cash' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', SaleSchema);
