const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
      itemName: String,
      qty: Number,
      price: Number,
      total: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, required: true, default: 0 },
  pendingAmount: { type: Number, required: true, default: 0 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
