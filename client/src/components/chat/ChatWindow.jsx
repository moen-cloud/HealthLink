import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { chatAPI } from '../../api/endpoints';

const ChatWindow = ({ selectedUser, onClose }) => {
  const { user } = useAuth();
  const { socket, sendMessage, sendTypingIndicator, isUserOnline } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ✅ FIX: Add safety check for selectedUser
  if (!selectedUser) {
    return null;
  }

  const conversationId = [user.id, selectedUser._id].sort().join('_');

  useEffect(() => {
    loadMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', handleReceiveMessage);
      socket.on('user-typing', handleTypingIndicator);

      return () => {
        socket.off('receive-message', handleReceiveMessage);
        socket.off('user-typing', handleTypingIndicator);
      };
    }
  }, [socket, selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await chatAPI.getMessages(selectedUser._id);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiveMessage = (data) => {
    if (data.senderId === selectedUser._id) {
      setMessages(prev => [...prev, {
        senderId: { _id: data.senderId },
        message: data.message,
        createdAt: data.timestamp
      }]);
    }
  };

  const handleTypingIndicator = (data) => {
    if (data.senderId === selectedUser._id) {
      setIsTyping(data.isTyping);
      if (data.isTyping) {
        setTimeout(() => setIsTyping(false), 3000);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageToSend = newMessage.trim();
    
    // Clear input immediately after sending
    setNewMessage('');

    try {
      const response = await chatAPI.sendMessage({
        receiverId: selectedUser._id,
        message: messageToSend
      });

      setMessages(prev => [...prev, response.data.data]);
      sendMessage(selectedUser._id, messageToSend, conversationId);
      sendTypingIndicator(selectedUser._id, false);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore message if send fails
      setNewMessage(messageToSend);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    sendTypingIndicator(selectedUser._id, true);
    
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(selectedUser._id, false);
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold">
              {selectedUser?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            {isUserOnline(selectedUser._id) && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{selectedUser?.name || 'Unknown User'}</h3>
            <p className="text-xs opacity-90">
              {isUserOnline(selectedUser._id) ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            // ✅ FIX: Add null checks for msg.senderId
            if (!msg || !msg.senderId) {
              return null; // Skip invalid messages
            }

            // My message = right side, Their message = left side
            const isMyMessage = msg.senderId._id === user.id;
            
            return (
              <div
                key={index}
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-end gap-2 max-w-[70%]">
                  {/* Avatar for received messages (left side) */}
                  {!isMyMessage && (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {selectedUser?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  
                  {/* Message bubble */}
                  <div className="flex flex-col">
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-sm ${
                        isMyMessage
                          ? 'bg-purple-600 text-white rounded-br-none'
                          : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                      }`}
                    >
                      <p className="break-words">{msg.message}</p>
                    </div>
                    <p className={`text-xs mt-1 px-2 ${
                      isMyMessage ? 'text-right text-gray-500' : 'text-left text-gray-500'
                    }`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  
                  {/* Avatar for sent messages (right side) */}
                  {isMyMessage && (
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {selectedUser?.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="px-6 py-4 border-t bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;