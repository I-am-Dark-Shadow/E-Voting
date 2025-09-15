import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema({
  voter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Ensures one user can only have one entry in this collection
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true,
  },
}, { timestamps: true });

const Vote = mongoose.model('Vote', VoteSchema);

export default Vote;