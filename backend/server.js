require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const appointmentRoutes = require('./routes/appointments');
const triageRoutes = require('./routes/triage');
const chatRoutes = require('./routes/chat'); // ✅ KEEP - Chat feature

// Initialize app
const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS - ✅ KEEP - For chat
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://healthlink-client.onrender.com',
      process.env.CLIENT_URL
    ].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://healthlink-client.onrender.com',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/chat', chatRoutes); // ✅ KEEP - Chat routes

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HealthLink API is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to HealthLink API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      appointments: '/api/appointments',
      triage: '/api/triage',
      chat: '/api/chat',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ✅ KEEP - Socket.io for real-time chat
const onlineUsers = new Map();

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.userId}`);
  
  onlineUsers.set(socket.userId, socket.id);
  io.emit('user-online', socket.userId);

  socket.on('send-message', async (data) => {
    const { receiverId, message, conversationId } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive-message', {
        senderId: socket.userId,
        message,
        conversationId,
        timestamp: new Date()
      });
    }
  });

  socket.on('typing', (data) => {
    const receiverSocketId = onlineUsers.get(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user-typing', {
        senderId: socket.userId,
        isTyping: data.isTyping
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.userId}`);
    onlineUsers.delete(socket.userId);
    io.emit('user-offline', socket.userId);
  });
});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n🚀 HealthLink Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`💬 Socket.io enabled`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health\n`);
});