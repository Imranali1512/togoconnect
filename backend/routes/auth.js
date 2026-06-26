const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { protect } = require('../middleware/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// ── POST /api/auth/register ──
router.post('/register', (req, res) => {
  try {
    const { name, email, password, role, city } = req.body;

    // Validation
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please fill all required fields' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const emailLower = email.toLowerCase().trim();

    // Check duplicate email — yahi important check hai
    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(emailLower);
    if (exists)
      return res.status(409).json({ message: 'This email is already registered. Please log in instead.' });

    const hashed = bcrypt.hashSync(password, 10);
    const result = db.prepare(
      'INSERT INTO users (name, email, password, role, city) VALUES (?, ?, ?, ?, ?)'
    ).run(name.trim(), emailLower, hashed, role || 'buyer', city || 'Lomé');

    const user = db.prepare('SELECT id, name, email, role, city FROM users WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ ...user, token: generateToken(user.id) });

  } catch (err) {
    // SQLite unique constraint error
    if (err.message && err.message.includes('UNIQUE constraint failed'))
      return res.status(409).json({ message: 'This email is already registered. Please log in instead.' });
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── POST /api/auth/login ──
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());

    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const match = bcrypt.compareSync(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid email or password' });

    const { password: _, ...safe } = user;
    res.json({ ...safe, token: generateToken(user.id) });

  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── GET /api/auth/me ──
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

// ── PUT /api/auth/profile ──
router.put('/profile', protect, (req, res) => {
  try {
    const { name, city, bio } = req.body;
    db.prepare('UPDATE users SET name=?, city=?, bio=? WHERE id=?')
      .run(name || req.user.name, city || req.user.city, bio || '', req.user.id);
    const updated = db.prepare('SELECT id, name, email, role, city, bio FROM users WHERE id=?').get(req.user.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

module.exports = router;
