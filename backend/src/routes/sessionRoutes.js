const express = require('express');
const router = express.Router();
const { getSessions, revokeSession } = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSessions);
router.delete('/:id', protect, revokeSession);

module.exports = router;
