import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRoutes from './src/routes/itemRoutes.js';
import { setupSocketHandlers } from './src/socket/socketHandlers.js';
import BidSimulator from './src/services/bidSimulator.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // In production, restrict this
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// REST API
app.use('/items', itemRoutes);

// Socket.io Handlers
setupSocketHandlers(io);

// Start Bid Simulator
if (process.env.SIMULATOR_ENABLED === 'true') {
  const simulator = new BidSimulator(io);
  simulator.start();
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
