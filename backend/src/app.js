// src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const vaultRoutes = require('./routes/vault');
const gdprRoutes = require('./routes/gdpr');

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/auth', authRoutes);
app.use('/vault', vaultRoutes);
app.use('/gdpr', gdprRoutes);

app.get('/', (req, res) => res.json({ message: 'Secure Data Vault API running...' }));

module.exports = app;
