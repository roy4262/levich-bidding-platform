/**
 * Simple per-item lock manager to prevent race conditions on bids.
 * Ensures only one bid is processed at a time for a specific item.
 */
class LockManager {
  constructor() {
    this.locks = new Set();
  }

  /**
   * Acquires a lock for a specific item ID.
   * @param {string} itemId - The ID of the item to lock
   * @returns {boolean} - True if lock was acquired, false if already locked
   */
  acquire(itemId) {
    if (this.locks.has(itemId)) {
      return false;
    }
    this.locks.add(itemId);
    return true;
  }

  /**
   * Releases a lock for a specific item ID.
   * @param {string} itemId - The ID of the item to unlock
   */
  release(itemId) {
    this.locks.delete(itemId);
  }
}

export const lockManager = new LockManager();
