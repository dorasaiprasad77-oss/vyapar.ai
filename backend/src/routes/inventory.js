const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// Add Item
router.post('/', async (req, res) => {
  const { userId, itemName, quantity, price, lowStockThreshold, unit } = req.body;
  try {
    const newItem = new Inventory({ userId, itemName, quantity, price, lowStockThreshold, unit });
    const saved = await newItem.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Error adding inventory' });
  }
});

// Get User Inventory
router.get('/:userId', async (req, res) => {
  try {
    const items = await Inventory.find({ userId: req.params.userId }).sort({ updatedAt: -1 });
    res.json(items);
  } catch (err) {
    // Return mock demo item if DB fails
    res.json([{ _id: "mock1", itemName: "Demo Item (No DB)", quantity: 5, price: 100, lowStockThreshold: 5 }]);
  }
});

// Update Stock
router.put('/:id', async (req, res) => {
  const { quantity, price } = req.body;
  try {
    const updated = await Inventory.findByIdAndUpdate(
      req.params.id, 
      { quantity, price, updatedAt: Date.now() }, 
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating inventory' });
  }
});

// Delete Item
router.delete('/:id', async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting item' });
  }
});

module.exports = router;
