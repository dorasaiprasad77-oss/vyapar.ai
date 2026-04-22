const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Trust proxy if you are behind a load balancer (Heroku, Render, AWS, etc)
app.set('trust proxy', 1);

// Security & Middlewares
// Supports one or multiple frontend URLs via CLIENT_URL (comma separated).
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (health checks, curl, server-to-server)
      if (!origin) return callback(null, true);

      // If CLIENT_URL is not set, allow all origins (safer fallback than '*' + credentials)
      if (allowedOrigins.length === 0) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error('CORS blocked: origin not allowed'));
    },
    credentials: true,
  })
);
app.use(express.json());

// Main Rate Limiter: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// Apply rate limiter to all API routes
app.use('/api/', limiter);

// Healthcheck Route (for Vercel/Render pinging)
app.get('/', (req, res) => {
  res.json({ status: "ok", message: "Vyapar AI Backend is running" });
});

// Body parser for passport
app.use(express.urlencoded({ extended: true }));

// Session for passport
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // true for https
}));

// Passport
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/orders', require('./routes/orders'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke internally!' });
});

// DB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vyapar-ai';

// Start Server immediately so it doesn't crash if DB fails
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// DB Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Successfully');
  })
  .catch((err) => {
    console.error('\n⚠️ MongoDB connection error: The database is not running or the URI is incorrect.');
    console.error('⚠️ Vyapar AI will load, but data fetching will fail until MongoDB is connected.\n');
  });

