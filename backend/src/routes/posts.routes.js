const express = require('express');
const { createPost, getPosts, updatePost, deletePost,likePost,getLikes, addComment, getComments,updateComment, deleteComment} = require('../controllers/posts.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

// Protected routes
router.post('/', protect, createPost);
router.get('/', protect, getPosts);
router.put('/:id',protect,updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like',protect,likePost);
router.get('/:id/likes', protect, getLikes);
router.post("/:id/comment", protect, addComment);
router.get("/:id/comments", protect, getComments);
router.put("/:postId/comments/:commentId", protect, updateComment);
router.delete("/:postId/comments/:commentId", protect, deleteComment);

module.exports = router;
