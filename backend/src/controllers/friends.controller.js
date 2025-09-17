const User = require('../models/User');

// @desc Send Friend Request
// @route POST /api/friends/request/:id
exports.sendFriendRequest = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    if (targetUser.friendRequests.includes(req.user._id)) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    if (targetUser.friends.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    targetUser.friendRequests.push(req.user._id);
    await targetUser.save();

    res.json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Accept Friend Request
// @route POST /api/friends/accept/:id
exports.acceptFriendRequest = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const requestIndex = req.user.friendRequests.indexOf(targetUser._id);
    if (requestIndex === -1) {
      return res.status(400).json({ message: 'No request from this user' });
    }

    // Remove request
    req.user.friendRequests.splice(requestIndex, 1);

    // Add each other as friends
    req.user.friends.push(targetUser._id);
    targetUser.friends.push(req.user._id);

    await req.user.save();
    await targetUser.save();

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Reject Friend Request
// @route POST /api/friends/reject/:id
exports.rejectFriendRequest = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    req.user.friendRequests = req.user.friendRequests.filter(
      id => id.toString() !== targetUser._id.toString()
    );

    await req.user.save();
    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Friend List
// @route GET /api/friends
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'username email');
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Pending Friend Requests
// @route GET /api/friends/requests
exports.getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friendRequests', 'username email');
    res.json(user.friendRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
