import User from '../models/User.js';
import generateToken from '../utils/jwt.js';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

// ... (euclideanDistance function remains the same)
const euclideanDistance = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return Infinity;
    let sum = 0;
    for (let i = 0; i < arr1.length; i++) {
      sum += (arr1[i] - arr2[i]) ** 2;
    }
    return Math.sqrt(sum);
};
  

// @desc    Register a new user (by an admin)
// @route   POST /api/auth/register
// @access  Admin only
const registerUser = async (req, res) => {
  // Now accepts 'role' from the request body
  const { name, email, voterId, faceDescriptors, role } = req.body;
  const REGISTRATION_THRESHOLD = 0.5;

  if (!name || !email || !voterId || !faceDescriptors || !req.file) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const userExists = await User.findOne({ $or: [{ email }, { voterId }] });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email or Voter ID already exists' });
    }

    const parsedDescriptor = JSON.parse(faceDescriptors)[0];

    const allUsers = await User.find({}, 'faceEmbedding');
    for (const user of allUsers) {
      const distance = euclideanDistance(user.faceEmbedding, parsedDescriptor);
      if (distance < REGISTRATION_THRESHOLD) {
        return res.status(400).json({ message: 'This face is already registered.' });
      }
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'voting-app-faces' },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Error uploading to Cloudinary' });
        }

        const newUser = await User.create({
          name,
          email,
          voterId,
          faceEmbedding: parsedDescriptor,
          profileImageUrl: result.secure_url,
          role: role || 'voter', // Set role from request, default to 'voter'
        });

        if (newUser) {
          // No need to send token back, as admin is performing the action
          res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            voterId: newUser.voterId,
            role: newUser.role,
          });
        } else {
          res.status(400).json({ message: 'Invalid user data' });
        }
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error });
  }
};

// ... (loginUser and getUserProfile functions remain the same)
const loginUser = async (req, res) => {
    const { faceDescriptors } = req.body;
    const LOGIN_THRESHOLD = 0.5;
  
    if (!faceDescriptors || faceDescriptors.length === 0) {
      return res.status(400).json({ message: 'No face descriptors provided' });
    }
  
    const users = await User.find({});
    let matchedUser = null;
  
    for (const user of users) {
      const distance = euclideanDistance(faceDescriptors, user.faceEmbedding);
      if (distance < LOGIN_THRESHOLD) {
        matchedUser = user;
        break;
      }
    }
  
    if (matchedUser) {
      const token = generateToken(matchedUser._id);
      res.json({
        _id: matchedUser._id,
        name: matchedUser.name,
        email: matchedUser.email,
        voterId: matchedUser.voterId,
        role: matchedUser.role,
        hasVoted: matchedUser.hasVoted,
        token,
      });
    } else {
      res.status(401).json({ message: 'Authentication failed. Face not recognized.' });
    }
  };
  
const getUserProfile = async (req, res) => {
    res.status(200).json(req.user);
};
  

export { registerUser, loginUser, getUserProfile };