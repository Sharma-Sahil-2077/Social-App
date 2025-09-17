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

// @desc Get all posts (feed)
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

// @desc Update post
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

    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
