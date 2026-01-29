import express from 'express';
import { getItems } from '../store/dataStore.js';

const router = express.Router();

// GET /items - Returns a list of auction items
router.get('/', (req, res) => {
  res.json(getItems());
});

export default router;
