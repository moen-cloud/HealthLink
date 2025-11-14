const express = require('express');
const {
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCount,
  getAvailableUsers
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/conversations', getConversations);
router.get('/messages/:userId', getMessages);
router.post('/messages', sendMessage);
router.get('/unread-count', getUnreadCount);
router.get('/available-users', getAvailableUsers);

module.exports = router;