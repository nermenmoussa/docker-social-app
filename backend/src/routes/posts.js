const router = require('express').Router();
const Post   = require('../models/Post');
const jwt    = require('jsonwebtoken');

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name avatar')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET posts by user
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'name avatar')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// CREATE post
router.post('/', auth, async (req, res) => {
  try {
    const post = await Post.create({ user: req.user.id, content: req.body.content });
    await post.populate('user', 'name avatar');
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    await post.deleteOne();
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// LIKE / UNLIKE post
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const liked = post.likes.includes(req.user.id);
    if (liked) post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    else post.likes.push(req.user.id);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ADD comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.unshift({ user: req.user.id, text: req.body.text });
    await post.save();
    await post.populate('comments.user', 'name');
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
