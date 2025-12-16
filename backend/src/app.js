// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const vaultRoutes = require('./routes/vault');
const gdprRoutes = require('./routes/gdpr');
const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// routes
app.use('/auth', authRoutes);
app.use('/vault', vaultRoutes);
app.use('/gdpr', gdprRoutes);
app.use('/users', userRoutes);
app.use('/sessions', sessionRoutes);

app.get('/', (req, res) => res.json({ message: 'Secure Data Vault API running...' }));

module.exports = app;
