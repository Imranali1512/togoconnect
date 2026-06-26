const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { protect } = require('../middleware/auth');

// GET /api/listings
router.get('/', (req, res) => {
  try {
    const { category, city, search, featured } = req.query;
    let query = 'SELECT * FROM listings WHERE active = 1';
    const params = [];

    if (category) { query += ' AND category = ?'; params.push(category); }
    if (city) { query += ' AND city LIKE ?'; params.push(`%${city}%`); }
    if (featured) { query += ' AND featured = 1'; }
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR category LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY featured DESC, created_at DESC';
    const listings = db.prepare(query).all(...params);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/listings/:id
router.get('/:id', (req, res) => {
  try {
    const listing = db.prepare('SELECT * FROM listings WHERE id = ? AND active = 1').get(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const seller = db.prepare('SELECT id, name, city, bio, avatar FROM users WHERE id = ?').get(listing.seller_id);
    const reviews = db.prepare('SELECT * FROM reviews WHERE listing_id = ? ORDER BY created_at DESC').all(listing.id);

    res.json({ ...listing, seller, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/listings
router.post('/', protect, (req, res) => {
  try {
    const { title, description, category, price, price_type, city, is_remote, image } = req.body;

    const result = db.prepare(`
      INSERT INTO listings (title, description, category, price, price_type, city, is_remote, seller_id, seller_name, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, description || '', category, price, price_type || 'fixed', city, is_remote ? 1 : 0, req.user.id, req.user.name, image || '');

    const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/listings/:id
router.put('/:id', protect, (req, res) => {
  try {
    const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.seller_id !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    const { title, description, category, price, price_type, city, is_remote, image } = req.body;
    db.prepare(`
      UPDATE listings SET title=?, description=?, category=?, price=?, price_type=?, city=?, is_remote=?, image=?
      WHERE id=?
    `).run(title, description, category, price, price_type, city, is_remote ? 1 : 0, image, req.params.id);

    const updated = db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/listings/:id
router.delete('/:id', protect, (req, res) => {
  try {
    const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.seller_id !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    db.prepare('UPDATE listings SET active = 0 WHERE id = ?').run(req.params.id);
    res.json({ message: 'Listing removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/listings/:id/review
router.post('/:id/review', protect, (req, res) => {
  try {
    const { rating, comment } = req.body;
    const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const already = db.prepare('SELECT id FROM reviews WHERE listing_id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (already) return res.status(400).json({ message: 'Already reviewed' });

    db.prepare('INSERT INTO reviews (listing_id, user_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)')
      .run(req.params.id, req.user.id, req.user.name, Number(rating), comment || '');

    // Update listing rating
    const stats = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE listing_id = ?').get(req.params.id);
    db.prepare('UPDATE listings SET rating = ?, num_reviews = ? WHERE id = ?')
      .run(Math.round(stats.avg * 10) / 10, stats.cnt, req.params.id);

    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
