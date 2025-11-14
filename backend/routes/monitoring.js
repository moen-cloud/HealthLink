const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Basic health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Detailed system status
router.get('/status', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Memory usage
    const memoryUsage = process.memoryUsage();
    
    // System metrics
    const metrics = {
      status: 'operational',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: {
        status: dbStatus,
        name: mongoose.connection.name
      },
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`
      },
      nodejs: {
        version: process.version,
        platform: process.platform
      }
    };

    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Readiness probe (for Kubernetes/Docker)
router.get('/ready', async (req, res) => {
  try {
    // Check if database is ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        ready: false,
        reason: 'Database not connected'
      });
    }

    // Check if essential services are running
    // Add more checks as needed (Redis, external APIs, etc.)

    res.status(200).json({
      ready: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      reason: error.message
    });
  }
});

// Liveness probe (for Kubernetes/Docker)
router.get('/live', (req, res) => {
  res.status(200).json({
    alive: true,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;