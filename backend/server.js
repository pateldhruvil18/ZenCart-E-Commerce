require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const connectDB = require('./config/mongo');
const logger = require('./config/logger');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security, Parsing & Compression Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(compression()); // GZIP text/json responses mapping 70%+ payload reductions

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// API Routes
app.use('/api', require('./api/routes/index'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', environment: process.env.NODE_ENV }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => logger.info(`Server running on http://localhost:${PORT}`));

module.exports = app;
