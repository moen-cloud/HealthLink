import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const { token, isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Only connect if user is authenticated and has token
    if (!isAuthenticated || !token || !user) {
      console.log('Socket: Not connecting - user not authenticated');
      return;
    }

    // ✅ FIXED: Don't add /api - Socket.io connects to root
    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    
    console.log('Socket: Attempting to connect to:', SOCKET_URL);

    
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setSocket(newSocket);
      setIsConnected(true);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      setIsConnected(false);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('user-online', (userId) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    });

    newSocket.on('user-offline', (userId) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    return () => {
      console.log('Socket: Disconnecting');
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [isAuthenticated, token, user]);

  const sendMessage = (receiverId, message, conversationId) => {
    if (socket && isConnected) {
      socket.emit('send-message', { receiverId, message, conversationId });
    } else {
      console.warn('Socket not connected. Message not sent.');
    }
  };

  const sendTypingIndicator = (receiverId, isTyping) => {
    if (socket && isConnected) {
      socket.emit('typing', { receiverId, isTyping });
    }
  };

  const value = {
    socket,
    onlineUsers,
    isConnected,
    sendMessage,
    sendTypingIndicator,
    isUserOnline: (userId) => onlineUsers.has(userId)
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};