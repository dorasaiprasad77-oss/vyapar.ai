const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Request OTP Route (Mock)
router.post('/request-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required' });
  // In a real app, integrate an SMS gateway like Twilio, Msg91 here.
  res.json({ message: 'OTP sent successfully (mock)', mockOtp: '1234' });
});

// Verify OTP & Login
router.post('/verify-otp', async (req, res) => {
  const { phone, otp, name, shopType } = req.body;
  
  // Instant bypass logic so it works without MongoDB
  if (phone) {
    return res.json({
      success: true,
      token: "dummy-token",
      user: { 
        _id: "dummy123", 
        phone: phone,
        name: name || "Test Store",
        shopType: shopType || "Kirana"
      }
    });
  }

  res.status(400).json({ error: 'Phone number required' });
});

// E-KYC Module (Mock)
router.post('/verifypan', async (req, res) => {
  const { pan } = req.body;
  if (!pan) return res.status(400).json({ error: 'PAN required' });
  
  // Fake verification
  const verified = pan.length === 10; // basic mock check
  if (verified) {
    res.json({ success: true, message: 'PAN Verified Successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid PAN Format' });
  }
});

module.exports = router;
