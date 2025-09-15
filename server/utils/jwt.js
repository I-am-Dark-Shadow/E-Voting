import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will expire in 30 days
  });
  return token;
};

export default generateToken;