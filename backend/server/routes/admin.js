const express = require('express');
require('dotenv').config();
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
const Changelog = require('../models/Changelog');
const Subscriber = require('../models/Subscriber');
const { sendNewsletter } = require('../../../utils/mailer');
const sendContactFormEmail = require('../../../utils/contactMail');
const jwtSecret = process.env.JWT_SECRET;

// Middleware for verifying JWT token
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    const user = await User.findById(req.userId);
    if (!user) throw new Error('User not found');
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Check login status
router.get('/api/auth-status', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ userExists: false });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.userId);
    if (!user) return res.json({ userExists: false });

    res.json({ userExists: true, username: user.username });
  } catch (err) {
    return res.json({ userExists: false });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie('token', token, { httpOnly: true });
    res.json({ message: 'Login successful', token, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).sort({ createdAt: 'desc' });
    const user = await User.findById(req.userId);

    const userIdObjectId = new mongoose.Types.ObjectId(req.userId);
    const recommendedUsers = await User.aggregate([
      { $match: { _id: { $ne: userIdObjectId } } },
      { $sample: { size: 3 } }
    ]);

    res.json({ posts, user, recommendedUsers });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Post
router.post('/add-post', authMiddleware, async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      body: req.body.body,
      user: req.userId
    });

    await newPost.save();
    res.json({ message: 'Post added successfully', success: true });
  } catch (error) {
    console.error('Add post error:', error);
    res.status(500).json({ message: 'Error adding post' });
  }
});



// Edit Post
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, user: req.userId });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.title = req.body.title;
    post.body = req.body.body;
    post.updatedAt = Date.now();
    await post.save();

    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Edit post error:', error);
    res.status(500).json({ message: 'Error updating post' });
  }
});

// Delete Post
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
});

// Newsletter
router.post('/send-newsletter', async (req, res) => {
  try {
    const { newsletterContent } = req.body;
    const subscribers = await Subscriber.find();

    for (let subscriber of subscribers) {
      await sendNewsletter(subscriber.email, 'Newsletter Update', newsletterContent);
    }

    res.json({ message: 'Newsletter sent successfully' });
  } catch (error) {
    console.error('Newsletter error:', error);
    res.status(500).json({ message: 'Error sending newsletter' });
  }
});

// Contact form
router.post('/submit-contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await sendContactFormEmail(name, email, message);
    res.json({ message: 'Mail sent successfully!' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ message: 'Error sending contact email' });
  }
});

// Changelog - View
router.get('/changelog', async (req, res) => {
  try {
    const changelogs = await Changelog.find().sort({ createdAt: 'desc' });
    res.json({ changelogs });
  } catch (error) {
    console.error('Changelog error:', error);
    res.status(500).json({ message: 'Error fetching changelog' });
  }
});

// Changelog - Add
router.post('/add-changelog', authMiddleware, async (req, res) => {
  try {
    if (req.user.username !== 'ayush848') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { featureDetails, versionNumber, updatedOn } = req.body;
    if (!featureDetails || !versionNumber || !updatedOn) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const newChangelog = new Changelog({
      featureDetails,
      versionNumber,
      updatedOn: new Date(updatedOn)
    });

    await newChangelog.save();
    res.json({ message: 'Changelog entry added successfully' });
  } catch (error) {
    console.error('Add changelog error:', error);
    res.status(500).json({ message: 'Error adding changelog' });
  }
});


// Logout
router.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
