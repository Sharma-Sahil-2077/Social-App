const express = require('express');
const { createPost, getPosts, updatePost, deletePost } = require('../controllers/posts.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

// Protected routes
router.post('/', protect, createPost);
router.get('/', protect, getPosts);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
