const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

// In-Memory Fallback if MongoDB is offline
let mockCustomers = [
  { _id: "cust1", name: "Raju Bhai", phone: "9876543210", pendingAmount: 1500 }
];

// Add Customer
router.post("/", async (req, res) => {
  const { userId, name, phone, pendingAmount } = req.body;
  try {
    const customer = new Customer({ userId, name, phone, pendingAmount: pendingAmount || 0 });
    const saved = await customer.save();
    return res.json(saved);
  } catch (err) {
    // Mock Save
    const mockCust = {
       _id: "mock_" + Date.now(),
       userId,
       name,
       phone,
       pendingAmount: pendingAmount || 0
    };
    mockCustomers.unshift(mockCust);
    return res.json(mockCust);
  }
});

// Get User Customers
router.get("/:userId", async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    if (!customers || customers.length === 0) throw new Error("Trigger Mock");
    res.json(customers);
  } catch (err) {
    // Return dynamically updated mock array
    res.json(mockCustomers);
  }
});

// Process Payment (Reduce Pending Amount)
router.post("/pay/:customerId", async (req, res) => {
  const { amount } = req.body;
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) throw new Error("Trigger Mock");

    // Reduce the pending amount
    customer.pendingAmount -= amount;
    if (customer.pendingAmount < 0) customer.pendingAmount = 0;

    await customer.save();
    res.json({ message: "Payment processed successfully", customer });
  } catch (err) {
    // Mock Payment Process
    const custIndex = mockCustomers.findIndex(c => c._id === req.params.customerId);
    if (custIndex !== -1) {
       mockCustomers[custIndex].pendingAmount -= amount;
       if (mockCustomers[custIndex].pendingAmount < 0) mockCustomers[custIndex].pendingAmount = 0;
       res.json({ message: "Mock payment processed!", customer: mockCustomers[custIndex] });
    } else {
       res.status(404).json({ error: "Customer not found" });
    }
  }
});

module.exports = router;
