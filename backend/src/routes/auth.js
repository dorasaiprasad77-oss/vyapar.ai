const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');

// Google Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        shopType: 'General',
        kycStatus: 'pending'
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    // Issue JWT
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '30d' }
    );
    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

// Request OTP Route (Mock - kept for fallback)
router.post('/request-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required' });
  res.json({ message: 'OTP sent successfully (mock)', mockOtp: '1234' });
});

// Verify OTP & Login (kept)
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

// eKYC with Razorpay (PAN verification)
router.post('/ekyc', async (req, res) => {
  const { pan, phone } = req.body;
  if (!pan) return res.status(400).json({ error: 'PAN required' });
  
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    // Note: Razorpay KYC API call (use their SDK/method for PAN verify)
    // Mock response for demo - replace with real API
    const verified = pan.length === 10 && pan.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
    const user = await User.findOneAndUpdate(
      { phone },
      { pan, kycStatus: verified ? 'verified' : 'rejected' },
      { new: true }
    );

    res.json({ 
      success: verified, 
      message: verified ? 'eKYC Verified Successfully' : 'Invalid PAN',
      kycStatus: user.kycStatus 
    });
  } catch (err) {
    res.status(500).json({ error: 'eKYC verification failed' });
  }
});

module.exports = router;
