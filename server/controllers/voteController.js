import Vote from '../models/Vote.js';
import User from '../models/User.js';
import Candidate from '../models/Candidate.js';

// @desc    Cast a vote
// @route   POST /api/votes/cast
// @access  Private
const castVote = async (req, res) => {
  const { candidateId } = req.body;
  const voterId = req.user._id;

  try {
    // Check if user has already voted
    const user = await User.findById(voterId);
    if (user.hasVoted) {
      return res.status(400).json({ message: 'You have already cast your vote.' });
    }

    // Record the vote
    await Vote.create({
      voter: voterId,
      candidate: candidateId,
    });

    // Update user's voting status
    await User.findByIdAndUpdate(voterId, { hasVoted: true });

    // Increment candidate's vote count
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { voteCount: 1 } });

    res.status(201).json({ message: 'Vote cast successfully!' });
  } catch (error) {
    // This can happen if a user tries to vote twice in quick succession
    if (error.code === 11000) {
        return res.status(400).json({ message: 'Vote already recorded.' });
    }
    res.status(500).json({ message: 'Server error casting vote', error });
  }
};

// @desc    Get vote results
// @route   GET /api/votes/results
// @access  Admin only
const getVoteResults = async (req, res) => {
  try {
    const candidates = await Candidate.find({}).sort({ voteCount: -1 });
    const totalVotes = await Vote.countDocuments();
    
    const results = candidates.map(candidate => ({
        _id: candidate._id,
        name: candidate.name,
        party: candidate.party,
        logoUrl: candidate.logoUrl,
        voteCount: candidate.voteCount,
        percentage: totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(2) : 0,
    }));

    res.status(200).json({ results, totalVotes });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching results', error });
  }
};

export { castVote, getVoteResults };