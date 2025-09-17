const express = require('express');
const router = express.Router();

// Temporary test route
router.get('/', (req, res) => {
  res.json({ message: 'Comments route works 🚀' });
});

module.exports = router;
