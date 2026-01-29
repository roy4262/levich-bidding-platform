// In-memory data store for auction items
const items = new Map();

// Initialize with some seed data
const initialItems = [
  {
    id: "1",
    title: "VIRAT KOHLI",

    startingPrice: 5000,
    currentBid: 5000,
    auctionEndTime: Date.now() + 300000, // 5 minutes from now
    highestBidder: null,
  },
  {
    id: "2",
    title: "M.S DHONI",

    startingPrice: 1000,
    currentBid: 1000,
    auctionEndTime: Date.now() + 600000, // 10 minutes from now
    highestBidder: null,
  },
  {
    id: "3",
    title: "AB DEVELLIARS",

    startingPrice: 3500,
    currentBid: 3500,
    auctionEndTime: Date.now() + 900000, // 15 minutes from now
    highestBidder: null,
  },
  {
    id: "4",
    title: "ROHIT SHARMA",

    startingPrice: 12000,
    currentBid: 12000,
    auctionEndTime: Date.now() + 1200000, // 20 minutes from now
    highestBidder: null,
  },
  {
    id: "5",
    title: "HARDIK PANDYA",

    startingPrice: 8500,
    currentBid: 8500,
    auctionEndTime: Date.now() + 1500000, // 25 minutes from now
    highestBidder: null,
  },
  {
    id: "6",
    title: "BUMRAH",

    startingPrice: 450,
    currentBid: 450,
    auctionEndTime: Date.now() + 1800000, // 30 minutes from now
    highestBidder: null,
  },
];

initialItems.forEach((item) => items.set(item.id, item));

export const getItems = () => Array.from(items.values());
export const getItem = (id) => items.get(id);
export const updateItem = (id, updates) => {
  const item = items.get(id);
  if (item) {
    const updatedItem = { ...item, ...updates };
    items.set(id, updatedItem);
    return updatedItem;
  }
  return null;
};
