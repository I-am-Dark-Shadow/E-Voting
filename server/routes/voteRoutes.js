import express from 'express';
import { castVote, getVoteResults } from '../controllers/voteController.js';
// isAdmin middleware টি import করার আর প্রয়োজন নেই, যদি না অন্য রুটে ব্যবহার করেন
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Cast a vote (accessible to any logged-in voter)
router.route('/cast').post(protect, castVote);

// Get election results (accessible to ANY logged-in user, voter or admin)
// শুধুমাত্র isAdmin middleware টি সরিয়ে দেওয়া হয়েছে
router.route('/results').get(protect, getVoteResults);

export default router;