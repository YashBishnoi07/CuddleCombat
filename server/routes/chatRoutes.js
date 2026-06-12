import express from 'express';
import Message from '../models/Message.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    // Get last 50 messages
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('user', 'username');
    
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
