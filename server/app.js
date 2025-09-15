import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js'; // New
import voteRoutes from './routes/voteRoutes.js';       // New

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL ||'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// A simple root route for testing
app.get('/', (req, res) => {
  res.send('Indian Voting System API is running...');
});

// Use the API routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes); // New
app.use('/api/votes', voteRoutes);           // New

export default app;