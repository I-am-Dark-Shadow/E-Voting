import express from 'express';
import { getCandidates, addCandidate } from '../controllers/candidateController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import multer from 'multer'; // Multer ইম্পোর্ট করা হয়েছে

const router = express.Router();

// Configure Multer for party logo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all candidates (accessible to any logged-in user)
router.route('/').get(protect, getCandidates);

// Add a new candidate with a logo (accessible only to admins)
router.route('/').post(protect, isAdmin, upload.single('logo'), addCandidate);

export default router;