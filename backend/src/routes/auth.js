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
  
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP required' });
  }

  if (otp !== '1234') {
    return res.status(400).json({ error: 'Invalid OTP. Please use 1234.' });
  }

  try {
    let user = await User.findOne({ phone });

    if (!user) {
      if (!name) {
        return res.status(400).json({ error: 'Name is required for new registration' });
      }
      user = new User({ phone, name, shopType: shopType || 'Kirana' });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user
    });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ error: 'Server error during OTP verification' });
  }
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
