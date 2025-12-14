// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);

// register
router.post('/register', async (req, res) => {
  try {
    const { email, password, consent } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Generate Verification Token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      email,
      passwordHash: hash,
      consent: { accepted: !!consent, timestamp: consent ? new Date() : null },
      isVerified: false,
      verificationToken
    });
    await user.save();

    // Send Verification Email
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyUrl = `${clientUrl}/verify-email?token=${verificationToken}`;
    await sendEmail(email, 'Verify your email', `Please click this link to verify your account: ${verifyUrl}`);

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Check Verification
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email address before logging in.' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user._id, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token required' });

    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now login.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
