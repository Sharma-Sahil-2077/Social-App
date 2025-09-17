const express = require('express');
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getFriendRequests,
} = require('../controllers/friends.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/request/:id', protect, sendFriendRequest);
router.post('/accept/:id', protect, acceptFriendRequest);
router.post('/reject/:id', protect, rejectFriendRequest);
router.get('/', protect, getFriends);
router.get('/requests', protect, getFriendRequests);

module.exports = router;
