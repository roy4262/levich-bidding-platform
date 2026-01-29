import { decode, encode } from '../utils/encoder.js';
import { auctionService } from '../services/auctionService.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send server time on connect (encoded)
    const timePayload = encode({
      type: 'SERVER_TIME',
      data: { serverTime: Date.now() }
    });
    socket.emit('message', timePayload);

    // Handle incoming messages
    socket.on('message', (buffer) => {
      try {
        const payload = decode(buffer);
        
        if (payload.type === 'BID_PLACED') {
          const { itemId, bidAmount } = payload.data;
          const result = auctionService.placeBid(itemId, bidAmount, socket.id);

          if (result.success) {
            // Broadcast successful bid to everyone
            const updatePayload = encode({
              type: 'UPDATE_BID',
              data: result.item
            });
            io.emit('message', updatePayload);
          } else {
            // Send rejection to the bidder
            const rejectPayload = encode({
              type: 'BID_REJECTED',
              data: {
                itemId,
                error: result.error
              }
            });
            socket.emit('message', rejectPayload);
          }
        }
      } catch (err) {
        console.error('Error decoding message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
