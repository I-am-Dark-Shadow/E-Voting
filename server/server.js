import app from './app.js';
import connectDB from './db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // First, connect to the database
    await connectDB();

    // Then, start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();