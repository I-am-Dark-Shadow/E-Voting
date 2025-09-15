import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  voterId: {
    type: String,
    required: [true, 'Please provide a Voter ID'],
    unique: true,
    trim: true,
  },
  faceEmbedding: {
    type: [Number], // Storing a single embedding array for the registration photo
    required: [true, 'Face embedding is required'],
  },
  profileImageUrl: {
      type: String,
      required: [true, 'Profile image URL is required'],
  },
  role: {
    type: String,
    enum: ['voter', 'admin'],
    default: 'voter',
  },
  hasVoted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;