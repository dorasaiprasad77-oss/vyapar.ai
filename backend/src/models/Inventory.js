const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true },
  lowStockThreshold: { type: Number, default: 5 },
  unit: { type: String, default: 'pcs' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', InventorySchema);
