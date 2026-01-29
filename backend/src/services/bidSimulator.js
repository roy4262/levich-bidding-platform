import { getItems } from '../store/dataStore.js';
import { auctionService } from './auctionService.js';
import { encode } from '../utils/encoder.js';

/**
 * Bid Simulator simulates bidding activity from other users.
 */
class BidSimulator {
  constructor(io) {
    this.io = io;
    this.interval = null;
  }

  /**
   * Starts the simulation.
   */
  start() {
    console.log('Starting bid simulation...');
    this.interval = setInterval(() => {
      this.simulateRandomBid();
    }, 1000); // Simulate a bid every 1 second
  }

  /**
   * Stops the simulation.
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /**
   * Picks a random item and places a bid if eligible.
   */
  simulateRandomBid() {
    const items = getItems().filter(item => item.auctionEndTime > Date.now());
    if (items.length === 0) return;

    const randomItem = items[Math.floor(Math.random() * items.length)];
    const increment = Math.floor(Math.random() * 50) + 10; // Random increment between 10 and 60
    const bidAmount = randomItem.currentBid + increment;

    const result = auctionService.placeBid(randomItem.id, bidAmount, 'SIMULATOR');

    if (result.success) {
      // Broadcast update using the same encoded format as real bids
      const payload = encode({
        type: 'UPDATE_BID',
        data: result.item
      });
      this.io.emit('message', payload);
      console.log(`[SIMULATOR] Bid placed on ${randomItem.title}: $${bidAmount}`);
    }
  }
}

export default BidSimulator;
