const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { protect } = require('../middleware/auth');

// GET /api/messages
router.get('/', protect, (req, res) => {
  try {
    const messages = db.prepare(`
      SELECT m.*,
        s.name as sender_name,
        r.name as receiver_name,
        l.title as listing_title
      FROM messages m
      LEFT JOIN users s ON m.sender_id = s.id
      LEFT JOIN users r ON m.receiver_id = r.id
      LEFT JOIN listings l ON m.listing_id = l.id
      WHERE m.sender_id = ? OR m.receiver_id = ?
      ORDER BY m.created_at DESC
    `).all(req.user.id, req.user.id);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/messages
router.post('/', protect, (req, res) => {
  try {
    const { receiver_id, listing_id, text } = req.body;
    if (!text || !receiver_id) return res.status(400).json({ message: 'Missing fields' });

    const result = db.prepare(
      'INSERT INTO messages (sender_id, receiver_id, listing_id, text) VALUES (?, ?, ?, ?)'
    ).run(req.user.id, receiver_id, listing_id || null, text);

    const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
