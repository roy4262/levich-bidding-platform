import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { decode, encode } from '../utils/encoder';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [serverTimeOffset, setServerTimeOffset] = useState(0);
  const [socketId, setSocketId] = useState(null);

  // Listeners map to store callbacks for different event types
  const listenersRef = useRef({});

  const registerListener = useCallback((type, callback) => {
    if (!listenersRef.current[type]) {
      listenersRef.current[type] = new Set();
    }
    listenersRef.current[type].add(callback);
    return () => listenersRef.current[type].delete(callback);
  }, []);

  const sendMessage = useCallback((type, data) => {
    if (socketRef.current) {
      const payload = encode({ type, data });
      socketRef.current.emit('message', payload);
    }
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setSocketId(socket.id);
      console.log('Connected to socket server');
    });

    socket.on('message', (buffer) => {
      try {
        const payload = decode(buffer);
        
        if (payload.type === 'SERVER_TIME') {
          const offset = payload.data.serverTime - Date.now();
          setServerTimeOffset(offset);
        }

        // Notify listeners
        const callbacks = listenersRef.current[payload.type];
        if (callbacks) {
          callbacks.forEach(cb => cb(payload.data));
        }
      } catch (err) {
        console.error('Error decoding socket message:', err);
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from socket server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    isConnected,
    socketId,
    serverTimeOffset,
    sendMessage,
    registerListener
  };
};
