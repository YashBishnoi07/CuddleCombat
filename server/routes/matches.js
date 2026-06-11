import express from 'express';
import Match from '../models/Match.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get matches for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    // Find matches where user is either userId1 or userId2
    const matches = await Match.find({
      $or: [{ userId1: userId }, { userId2: userId }]
    }).sort({ createdAt: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
