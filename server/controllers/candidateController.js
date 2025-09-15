import Candidate from '../models/Candidate.js';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Private
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({});
    res.status(200).json(candidates);
  } catch (error)
 {
    res.status(500).json({ message: 'Server error fetching candidates' });
  }
};

// @desc    Add a new candidate with a logo
// @route   POST /api/candidates
// @access  Admin only
const addCandidate = async (req, res) => {
    const { name, party } = req.body;

    if (!name || !party || !req.file) {
        return res.status(400).json({ message: 'Please provide name, party, and a logo file.' });
    }

    // Upload logo to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'voting-app-logos' },
        async (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ message: 'Error uploading logo to Cloudinary' });
            }

            try {
                const candidate = await Candidate.create({
                    name,
                    party,
                    logoUrl: result.secure_url,
                });
                res.status(201).json(candidate);
            } catch (dbError) {
                res.status(400).json({ message: 'Invalid candidate data', error: dbError });
            }
        }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

export { getCandidates, addCandidate };