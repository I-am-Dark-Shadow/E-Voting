import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  party: {
    type: String,
    required: true,
    trim: true,
  },
  logoUrl: {
    type: String,
    required: true,
  },
  voteCount: {
    type: Number,
    default: 0,
  }
});

const Candidate = mongoose.model('Candidate', CandidateSchema);

export default Candidate;