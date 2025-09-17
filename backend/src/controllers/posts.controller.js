const Post = require('../models/Post');

// @desc Create post
// @route POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const { text, image } = req.body;

    const post = await Post.create({
      userId: req.user._id,
      text,
      image,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route GET /api/posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route PUT /api/posts/:id
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    post.text = req.body.text || post.text;
    post.image = req.body.image || post.image;
    post.updatedAt = Date.now();

    const updated = await post.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete post
// @route DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const post = await Post.findById(id)
      .populate('userId', 'username')
      .populate('comments.userId', 'username');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Ownership check
    if (post.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.text = text || post.text;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if user already liked
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      // Not liked yet → add like
      post.likes.push(userId);
    } else {
      // Already liked → remove like
      post.likes.splice(index, 1);
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/posts/:id/likes
exports.getLikes = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("likes", "username email");
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post.likes); // return array of users
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

  exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = {
      userId: req.user.id,
      text: req.body.text,
    };

    post.comments.push(newComment);
    await post.save();

    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all comments of a post
  exports.getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("comments.userId", "username");
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    comment.text = text;
    await post.save();

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete comment
// posts.controller.js
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params; 

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // check if user owns the comment
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.deleteOne();
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
