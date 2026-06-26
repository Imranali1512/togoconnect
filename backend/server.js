require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Init DB first
require('./db/database');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/messages', require('./routes/messages'));

// Health check
app.get('/', (req, res) => res.json({ message: 'TogoConnect API running ✅', db: 'SQLite' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`\n🚀 Server running on http://localhost:${PORT}\n`));
