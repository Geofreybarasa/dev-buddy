require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: { 
    success: false, 
    error: {
      code: 'RATE_LIMIT_ERROR',
      message: 'Too many requests. Please try again later.'
    }
  }
});
app.use('/api/', limiter);

// Import routes
const explainRoute = require('./routes/explain.route');
const testRoute = require('./routes/test.route');
const docsRoute = require('./routes/docs.route');
const analyticsRoute = require('./routes/analytics.route');
const { getAIStatus } = require('./services/ai.service');

// Routes
app.use('/api/explain', explainRoute);
app.use('/api/generate-tests', testRoute);
app.use('/api/generate-docs', docsRoute);
app.use('/api/analytics', analyticsRoute);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const aiStatus = getAIStatus();
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      watsonx: process.env.WATSONX_API_KEY ? 'configured' : 'not configured',
      server: 'running'
    },
    aiMode: {
      current: aiStatus.currentMode,
      watsonxAvailable: aiStatus.watsonxAvailable,
      forcedMock: aiStatus.useMockForced,
      lastCheck: aiStatus.lastCheck,
      message: aiStatus.currentMode === 'watsonx'
        ? '✅ Using IBM WatsonX AI'
        : aiStatus.useMockForced
          ? '📝 Mock mode (forced via USE_MOCK=true)'
          : '⚠️  Mock mode (WatsonX unavailable)'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Dev Buddy API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      explain: '/api/explain',
      generateTests: '/api/generate-tests',
      generateDocs: '/api/generate-docs',
      analytics: '/api/analytics'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      timestamp: new Date().toISOString()
    }
  };
  
  res.status(statusCode).json(errorResponse);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
      path: req.path
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Dev Buddy Backend running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🤖 WatsonX API Key: ${process.env.WATSONX_API_KEY ? 'Configured ✅' : 'Not configured ❌'}`);
  console.log(`🎯 AI Mode: ${process.env.USE_MOCK === 'true' ? 'Mock (forced)' : 'WatsonX with auto-fallback'}`);
});

module.exports = app;

// Made with Bob
