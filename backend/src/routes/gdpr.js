// src/routes/gdpr.js
const express = require('express');
const auth = require('../middleware/auth');
const VaultItem = require('../models/VaultItem');
const User = require('../models/User');
const { decrypt } = require('../utils/crypto');

const router = express.Router();

// export user data (Right of Access)
router.get('/export', auth, async (req, res) => {
  try {
    const user = req.user.toObject();
    delete user.passwordHash;

    const items = await VaultItem.find({ userId: req.user._id });
    const decryptedItems = items.map(i => ({
      id: i._id,
      label: i.label,
      content: decrypt({ data: i.data, iv: i.iv, tag: i.tag }),
      createdAt: i.createdAt
    }));

    const exportObj = { user, vault: decryptedItems };
    res.setHeader('Content-Disposition', `attachment; filename=data-export-${req.user._id}.json`);
    res.json(exportObj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// delete all user data (Right to be forgotten)
router.delete('/deleteAll', auth, async (req, res) => {
  try {
    await VaultItem.deleteMany({ userId: req.user._id });
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'All user data deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// record consent (simple)
router.post('/consent', auth, async (req, res) => {
  try {
    const { accepted } = req.body;
    req.user.consent = { accepted: !!accepted, timestamp: accepted ? new Date() : null };
    await req.user.save();
    res.json({ message: 'Consent updated', consent: req.user.consent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
