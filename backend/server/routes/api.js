// server/routes/api.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
const Changelog = require('../models/Changelog');
const Subscriber = require('../models/Subscriber');
const { sendNewsletter } = require('../../utils/mailer');
const sendContactFormEmail = require('../../utils/contactMail');
const jwtSecret = process.env.JWT_SECRET;

// ==================== Middleware ====================
let demoUserId;
async function findDemoUserId() {
  try {
    const demoUser = await User.findOne({ username: 'demoID' });
    if (demoUser) demoUserId = demoUser._id;
    else console.error('Demo user not found. Please create a user with username "demoID".');
  } catch (error) {
    console.error('Error finding demo user:', error);
  }
}
findDemoUserId();

const attachUserForApi = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, jwtSecret, async (err, decodedToken) => {
      if (err) {
        req.username = null;
        req.userExists = false;
      } else {
        try {
          const user = await User.findById(decodedToken.userId);
          if (user) {
            req.userId = decodedToken.userId;
            req.username = user.username;
            req.userExists = true;
          } else {
            req.username = null;
            req.userExists = false;
          }
        } catch (dbError) {
          console.error('User fetch error:', dbError);
          req.username = null;
          req.userExists = false;
        }
      }
      next();
    });
  } else {
    req.username = null;
    req.userExists = false;
    next();
  }
};

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ type: 'error', message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    const user = await User.findById(req.userId);
    if (!user) throw new Error('User not found');
    req.user = user;
    next();
  } catch {
    res.status(401).json({ type: 'error', message: 'Invalid token' });
  }
};

// ==================== Public API Routes ====================

router.get('/posts', attachUserForApi, async (req, res) => {
  try {
    const perPage = 10;
    const page = parseInt(req.query.page) || 1;
    let query = req.userExists && req.userId ? { user: req.userId } : demoUserId ? { user: demoUserId } : {};

    const posts = await Post.find(query).sort({ createdAt: -1 }).skip(perPage * (page - 1)).limit(perPage);
    const count = await Post.countDocuments(query);
    const hasNextPage = page + 1 <= Math.ceil(count / perPage);

    res.json({ posts, nextPage: hasNextPage ? page + 1 : null, username: req.username, userExists: req.userExists });
  } catch (error) {
    console.error('Posts error:', error);
    res.status(500).json({ type: 'error', message: 'Could not fetch posts' });
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ type: 'error', message: 'Post not found' });
    res.json(post);
  } catch (error) {
    console.error('Single post error:', error);
    res.status(500).json({ type: 'error', message: 'Could not fetch post' });
  }
});

router.post('/search', async (req, res) => {
  try {
    const term = req.body.searchTerm.replace(/[^a-zA-Z0-9]/g, '');
    const results = await Post.find({
      $or: [
        { title: { $regex: new RegExp(term, 'i') } },
        { body: { $regex: new RegExp(term, 'i') } }
      ]
    });
    res.json({ searchResults: results });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ type: 'error', message: 'Search failed' });
  }
});

router.get('/about', (req, res) => {
  res.json({
    title: 'About MyDay Blog',
    content: 'This is a simple blog created with Node.js, Express, MongoDB, and Vue.js.'
  });
});

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ type: 'error', message: 'Invalid email format.' });
    }

    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.status(409).json({ type: 'error', message: 'Already subscribed.' });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(200).json({ type: 'success', message: 'Subscribed successfully!' });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ type: 'error', message: 'Subscription failed.' });
  }
});

router.get('/unsubscribe', async (req, res) => {
  try {
    const { token } = req.query;
    const subscriber = await Subscriber.findOne({ unsubscribeToken: token });
    if (!subscriber) return res.status(400).send('Invalid or expired unsubscribe link.');
    await Subscriber.deleteOne({ _id: subscriber._id });
    res.status(200).send('<h1>You have successfully unsubscribed.</h1><p>You may close this tab.</p>');
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).send('Unsubscription failed.');
  }
});

// ==================== Authenticated Routes ====================

router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).sort({ createdAt: -1 });
    const user = await User.findById(req.userId);
    res.json({ posts, user });
  } catch {
    res.status(500).json({ type: 'error', message: 'Dashboard fetch error' });
  }
});

router.post('/add-post', authMiddleware, async (req, res) => {
  try {
    const newPost = new Post({ title: req.body.title, body: req.body.body, user: req.userId });
    await newPost.save();
    res.json({ type: 'success', message: 'Post added' });
  } catch {
    res.status(500).json({ type: 'error', message: 'Add post failed' });
  }
});

router.put('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, user: req.userId });
    if (!post) return res.status(404).json({ type: 'error', message: 'Post not found' });

    post.title = req.body.title;
    post.body = req.body.body;
    post.updatedAt = Date.now();
    await post.save();

    res.json({ type: 'success', message: 'Post updated' });
  } catch {
    res.status(500).json({ type: 'error', message: 'Edit post failed' });
  }
});

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
  try {
    console.log('[DELETE] Request received to delete post with ID:', req.params.id);
    console.log('[DELETE] Authenticated user from token:', req.user);

    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!post) {
      console.log('[DELETE] Post not found or user not authorized.');
      return res.status(404).json({ type: 'error', message: 'Post not found or unauthorized' });
    }

    console.log('[DELETE] Post deleted successfully:', post._id);
    res.json({ type: 'success', message: 'Post deleted successfully' });

  } catch (error) {
    console.error('[DELETE ERROR]', error);
    res.status(500).json({ type: 'error', message: 'Delete post failed' });
  }
});

router.post('/send-newsletter', async (req, res) => {
  try {
    const { newsletterContent } = req.body;
    const subscribers = await Subscriber.find();

    for (let sub of subscribers) {
      await sendNewsletter(sub.email, 'Newsletter Update', newsletterContent);
    }

    res.json({ type: 'success', message: 'Newsletter sent' });
  } catch {
    res.status(500).json({ type: 'error', message: 'Newsletter failed' });
  }
});

router.post('/submit-contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await sendContactFormEmail(name, email, message);
    res.json({ type: 'success', message: 'Mail sent successfully!' });
  } catch {
    res.status(500).json({ type: 'error', message: 'Mail failed to send' });
  }
});

router.get('/changelog', async (req, res) => {
  try {
    const changelogs = await Changelog.find().sort({ createdAt: -1 });
    res.json({ changelogs });
  } catch {
    res.status(500).json({ type: 'error', message: 'Changelog fetch failed' });
  }
});

router.post('/add-changelog', authMiddleware, async (req, res) => {
  try {
    if (req.user.username !== 'ayush848') {
      return res.status(403).json({ type: 'error', message: 'Unauthorized' });
    }

    const { featureDetails, versionNumber, updatedOn } = req.body;
    if (!featureDetails || !versionNumber || !updatedOn) {
      return res.status(400).json({ type: 'error', message: 'All fields required' });
    }

    const newChangelog = new Changelog({
      featureDetails,
      versionNumber,
      updatedOn: new Date(updatedOn)
    });

    await newChangelog.save();
    res.json({ type: 'success', message: 'Changelog added' });
  } catch {
    res.status(500).json({ type: 'error', message: 'Add changelog failed' });
  }
});

module.exports = router;
