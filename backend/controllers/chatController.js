const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
    .populate('participants', 'name email role')
    .sort({ lastMessageTime: -1 });

    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get messages for a conversation
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Create conversation ID (sorted to ensure consistency)
    const conversationId = [currentUserId, userId].sort().join('_');

    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name role')
      .populate('receiverId', 'name role')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        receiverId: currentUserId,
        read: false
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    // Create conversation ID
    const conversationId = [senderId, receiverId].sort().join('_');

    // Create message
    const newMessage = await Message.create({
      conversationId,
      senderId,
      receiverId,
      message
    });

    // Update or create conversation
    await Conversation.findOneAndUpdate(
      {
        participants: { $all: [senderId, receiverId] }
      },
      {
        participants: [senderId, receiverId],
        lastMessage: message,
        lastMessageTime: new Date()
      },
      { upsert: true, new: true }
    );

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'name role')
      .populate('receiverId', 'name role');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user.id,
      read: false
    });

    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get available users to chat with
exports.getAvailableUsers = async (req, res) => {
  try {
    const currentUser = req.user;
    
    // Patients can only chat with doctors, doctors can chat with all patients
    const query = currentUser.role === 'patient' 
      ? { role: 'doctor' }
      : { role: 'patient' };
    
    const users = await User.find(query).select('name email role');

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};