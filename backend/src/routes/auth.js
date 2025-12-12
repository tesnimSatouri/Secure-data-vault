// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
    const user = new User({
      email,
      passwordHash: hash,
      consent: { accepted: !!consent, timestamp: consent ? new Date() : null }
    });
    await user.save();

    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, userId: user._id, email: user.email });
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

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user._id, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
