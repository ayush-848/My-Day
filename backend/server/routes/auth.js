// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const jwtSecret = process.env.JWT_SECRET;

// Check Auth Status
router.get('/auth-status', async (req, res) => {
  const token = req.cookies.token;
  console.log('Checking auth status...');

  if (!token) {
    console.log('No token found in cookies');
    return res.json({ userExists: false });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('User not found in DB');
      return res.json({ userExists: false });
    }

    console.log(`User authenticated: ${user.username}`);
    res.json({ userExists: true, username: user.username });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.json({ userExists: false });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt: ${username}`);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Login failed: user not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log('Login failed: incorrect password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie('token', token, { httpOnly: true });

    console.log(`Login successful for user: ${username}`);
    res.json({ message: 'Login successful', token, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register Route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log(`Register attempt: ${username}`);

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Registration failed: user already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    console.log(`User registered successfully: ${username}`);
    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  console.log('Logout requested');
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
