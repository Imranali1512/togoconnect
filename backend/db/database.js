const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'togoconnect.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'buyer',
    city TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    category TEXT NOT NULL,
    price REAL NOT NULL,
    price_type TEXT DEFAULT 'fixed',
    city TEXT NOT NULL,
    is_remote INTEGER DEFAULT 0,
    seller_id INTEGER NOT NULL,
    seller_name TEXT,
    image TEXT DEFAULT '',
    rating REAL DEFAULT 0,
    num_reviews INTEGER DEFAULT 0,
    featured INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    user_name TEXT,
    rating INTEGER NOT NULL,
    comment TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
  );
`);

// Seed demo listings if empty
const count = db.prepare('SELECT COUNT(*) as c FROM listings').get();
if (count.c === 0) {
  // Create demo seller
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync('demo123', 10);
  
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password, role, city)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const seller = insertUser.run('Demo Seller', 'demo@togoconnect.com', hash, 'seller', 'Lomé');
  const sellerId = seller.lastInsertRowid;

  const insertListing = db.prepare(`
    INSERT INTO listings (title, description, category, price, price_type, city, is_remote, seller_id, seller_name, rating, num_reviews, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const demos = [
    ['Expert Plumbing Repairs & Installation', 'Professional plumbing services including pipe installation, leak repairs, bathroom fitting, and emergency call-outs. Over 10 years of experience.', 'Plumbing', 15000, 'from', 'Lomé', 0, sellerId, 'Kossi Mensah', 4.8, 42, 1],
    ['Mobile Barber — Fresh Cuts at Home', 'I come to you! Get a fresh cut, beard trim, or skin fade without leaving your home. Available 7 days a week across Lomé.', 'Barber', 5000, 'fixed', 'Lomé', 0, sellerId, 'Yao Adjovi', 4.9, 87, 1],
    ['Math & Science Tutoring (Lycée level)', 'Specialising in mathematics and physical sciences for lycée students. Online sessions via video call. Exam preparation and homework help.', 'Tutoring', 8000, 'fixed', 'Remote', 1, sellerId, 'Afi Komlan', 4.7, 31, 1],
    ['Event & Wedding Photography', 'Capturing your most important moments. Weddings, traditional ceremonies, corporate events, portraits. Full day coverage available.', 'Photography', 75000, 'from', 'Lomé', 0, sellerId, 'Komi Photography', 5.0, 19, 1],
    ['Laptop & Phone Repair', 'Fast and reliable repair service for all brands. Screen replacement, battery, software issues. Warranty on all repairs.', 'Tech Repair', 10000, 'from', 'Sokodé', 0, sellerId, 'Tech Fix Togo', 4.6, 54, 1],
    ['Home Cleaning Service', 'Professional home and office cleaning. Bring all equipment. Weekly, bi-weekly or one-time service available.', 'Cleaning', 12000, 'fixed', 'Lomé', 0, sellerId, 'Ama Clean Co.', 4.5, 68, 1],
    ['Custom Tailoring & Traditional Wear', 'Expert tailoring for traditional and modern wear. Measurements taken at home. Ready in 5-7 days.', 'Tailoring', 20000, 'from', 'Kpalimé', 0, sellerId, 'Atelier Sika', 4.9, 112, 1],
    ['Website & Logo Design', 'Professional web design and branding. Responsive websites, logo packages, social media kits. Portfolio available on request.', 'Design', 50000, 'from', 'Remote', 1, sellerId, 'Studio Akossiwa', 4.8, 27, 1],
  ];

  demos.forEach(d => insertListing.run(...d));
  console.log('✅ Demo data seeded');
}

console.log('✅ SQLite database ready');

module.exports = db;
