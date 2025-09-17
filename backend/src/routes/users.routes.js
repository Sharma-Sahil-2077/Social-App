const express = require('express');
const { getMe, updateMe, deleteMe, getAllUsers } = require('../controllers/users.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.delete('/me', protect, deleteMe);

// Public/demo route
router.get('/', getAllUsers);

module.exports = router;
