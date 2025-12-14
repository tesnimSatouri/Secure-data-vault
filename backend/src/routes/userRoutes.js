const express = require('express');
const router = express.Router();
const { getMe, updateMe, changePassword, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/change-password', protect, changePassword);
router.delete('/me', protect, deleteAccount);

module.exports = router;
