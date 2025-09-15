import express from 'express';
import multer from 'multer';
import {
  registerUser,
  loginUser,
  getUserProfile
} from '../controllers/authController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js'; // isAdmin ইম্পোর্ট করা হয়েছে

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Register route is now protected and admin-only
router.post('/register', protect, isAdmin, upload.single('image'), registerUser);

// Login route remains public
router.post('/login', loginUser);

// Profile route is for any logged-in user
router.get('/me', protect, getUserProfile);

export default router;