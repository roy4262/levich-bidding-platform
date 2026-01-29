import { getItem, updateItem } from '../store/dataStore.js';
import { lockManager } from './lockManager.js';

/**
 * Auction Service handles the business logic for placing bids.
 */
class AuctionService {
  /**
   * Places a bid on an item.
   * @param {string} itemId - The ID of the item
   * @param {number} bidAmount - The amount to bid
   * @param {string} bidderId - The ID of the bidder (socket.id or 'SIMULATOR')
   * @returns {Object} - { success: boolean, item?: Object, error?: string }
   */
  placeBid(itemId, bidAmount, bidderId) {
    // 1. Acquire lock for this item
    if (!lockManager.acquire(itemId)) {
      return { success: false, error: 'OUTBID' }; // Race condition: someone else is bidding
    }

    try {
      const item = getItem(itemId);

      // 2. Validate item exists
      if (!item) {
        return { success: false, error: 'Item not found' };
      }

      // 3. Validate auction hasn't ended
      if (Date.now() > item.auctionEndTime) {
        return { success: false, error: 'Auction has ended' };
      }

      // 4. Validate bid amount
      if (bidAmount <= item.currentBid) {
        return { success: false, error: 'OUTBID' }; // Bid is too low or equal
      }

      // 5. Update item with new bid
      const updatedItem = updateItem(itemId, {
        currentBid: bidAmount,
        highestBidder: bidderId
      });

      return { success: true, item: updatedItem };
    } finally {
      // 6. Always release the lock
      lockManager.release(itemId);
    }
  }
}

export const auctionService = new AuctionService();
