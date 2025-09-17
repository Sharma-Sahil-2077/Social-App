const User = require('../models/User');

// @desc Get current user profile
// @route GET /api/users/me
exports.getMe = async (req, res) => {
  res.json(req.user);
};

// @desc Update profile
// @route PUT /api/users/me
exports.updateMe = async (req, res) => {
  try {
    const { username, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, bio },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete user
// @route DELETE /api/users/me
exports.deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all users (for testing/demo)
// @route GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
