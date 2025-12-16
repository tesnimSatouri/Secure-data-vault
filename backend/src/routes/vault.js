// src/routes/vault.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const VaultItem = require('../models/VaultItem');
const { encrypt, decrypt } = require('../utils/crypto');

const router = express.Router();

// create vault item (encrypted)
router.post('/', protect, async (req, res) => {
  try {
    const { label, content, category } = req.body;
    if (!content) return res.status(400).json({ message: 'content required' });

    const encrypted = encrypt(content);

    const item = new VaultItem({
      userId: req.user._id,
      label,
      category: category || 'General',
      data: encrypted.data,
      iv: encrypted.iv,
      tag: encrypted.tag
    });
    await item.save();
    res.status(201).json({ _id: item._id, label: item.label, createdAt: item.createdAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// list items (do not return decrypted data by default)
router.get('/', protect, async (req, res) => {
  try {
    const items = await VaultItem.find({ userId: req.user._id }).select('-data -iv -tag');
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// get one item (decrypted)
router.get('/:id', protect, async (req, res) => {
  try {
    const item = await VaultItem.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ message: 'Not found' });
    const decrypted = decrypt({ data: item.data, iv: item.iv, tag: item.tag });
    res.json({ id: item._id, label: item.label, category: item.category, content: decrypted, createdAt: item.createdAt });
  } catch (err) {
    console.error('Decryption error:', err.message);
    console.error('Item:', req.params.id);
    console.error('Stack:', err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// update item
router.put('/:id', protect, async (req, res) => {
  try {
    const { label, content, category } = req.body;

    const item = await VaultItem.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ message: 'Not found' });

    if (label) item.label = label;
    if (category) item.category = category;
    if (content) {
      const encrypted = encrypt(content);
      item.data = encrypted.data;
      item.iv = encrypted.iv;
      item.tag = encrypted.tag;
    }

    await item.save();

    // Return updated item
    res.json({ _id: item._id, label: item.label, createdAt: item.createdAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// delete item
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await VaultItem.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
