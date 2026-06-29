const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('crypto');
const db = require('../utils/db');

const sign = (user) => jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET || 'secret',
  { expiresIn: '7d' }
);

const safe = (u) => ({ id: u.id, email: u.email, name: u.name, avatar: u.avatar, settings: u.settings });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    if (db.findUserByEmail(email)) return res.status(409).json({ error: 'Email already in use' });

    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const hash = await bcrypt.hash(password, 10);
    const user = db.createUser({
      id, name, email, password: hash,
      avatar: null,
      settings: {
        theme: 'dark', unit: 'metric', notifications: true,
        language: 'en', defaultCity: 'Seattle', autoLocation: false
      },
      createdAt: new Date().toISOString()
    });

    // Seed a welcome notification
    db.addNotification(id, { title: 'Welcome to Weather AI!', body: 'Your account is set up. Search any city to get started.', type: 'info' });

    res.status(201).json({ token: sign(user), user: safe(user) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = db.findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ token: sign(user), user: safe(user) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Me
router.get('/me', require('../middleware/auth'), (req, res) => {
  res.json(safe(req.user));
});

module.exports = router;
