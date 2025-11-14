const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');

// Import app without starting the server
let app;

// Test suite for authentication
describe('Authentication API', () => {
  beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    
    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    // Connect to test database
    await mongoose.connect(process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/healthlink-test');
    
    // Import app after mongoose is connected
    app = require('../server');
  });

  afterAll(async () => {
    // Clean up and disconnect
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  // Clean up before each test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new patient', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Patient',
          email: 'testpatient@example.com',
          password: 'password123',
          role: 'patient',
          age: 25,
          gender: 'male'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe('testpatient@example.com');
    });

    it('should register a new doctor', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Doctor',
          email: 'testdoctor@example.com',
          password: 'password123',
          role: 'doctor'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('doctor');
    });

    it('should fail with duplicate email', async () => {
      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate User',
          email: 'duplicate@example.com',
          password: 'password123'
        });

      // Try to create duplicate
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another User',
          email: 'duplicate@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Invalid Email User',
          email: 'notanemail',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
    });

    it('should fail with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Short Password User',
          email: 'shortpass@example.com',
          password: '123'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login Test User',
          email: 'logintest@example.com',
          password: 'password123',
          role: 'patient'
        });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should fail with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeEach(async () => {
      // Register and login to get token
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Token Test User',
          email: 'tokentest@example.com',
          password: 'password123'
        });
      
      token = registerRes.body.data.token;
    });

    it('should get current user with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('tokentest@example.com');
    });

    it('should fail without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.statusCode).toBe(401);
    });

    it('should fail with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token-here');

      expect(res.statusCode).toBe(401);
    });
  });
});

// Run tests with: npm test