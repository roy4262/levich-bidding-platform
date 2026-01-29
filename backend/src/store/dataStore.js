// In-memory data store for auction items
const items = new Map();

// Time constants
const HOUR = 60 * 60 * 1000;
const BASE_HOURS = 24;

// Seed data (without auctionEndTime)
const initialItems = [
  {
    id: "1",
    title: "VIRAT KOHLI",
    startingPrice: 5000,
    currentBid: 5000,
    highestBidder: null,
  },
  {
    id: "2",
    title: "M.S DHONI",
    startingPrice: 1000,
    currentBid: 1000,
    highestBidder: null,
  },
  {
    id: "3",
    title: "AB DEVELLIARS",
    startingPrice: 3500,
    currentBid: 3500,
    highestBidder: null,
  },
  {
    id: "4",
    title: "ROHIT SHARMA",
    startingPrice: 12000,
    currentBid: 12000,
    highestBidder: null,
  },
  {
    id: "5",
    title: "HARDIK PANDYA",
    startingPrice: 8500,
    currentBid: 8500,
    highestBidder: null,
  },
  {
    id: "6",
    title: "BUMRAH",
    startingPrice: 450,
    currentBid: 450,
    highestBidder: null,
  },
];

// Initialize items with increasing auction times: 24, 48, 72...
initialItems.forEach((item, index) => {
  items.set(item.id, {
    ...item,
    auctionEndTime: Date.now() + (index + 1) * BASE_HOURS * HOUR,
  });
});

// Export helpers
export const getItems = () => Array.from(items.values());

export const getItem = (id) => items.get(id);

export const updateItem = (id, updates) => {
  const item = items.get(id);
  if (!item) return null;

  const updatedItem = { ...item, ...updates };
  items.set(id, updatedItem);
  return updatedItem;
};
