const config = require('../config/config');
const JWT_SECRET = config.jwtSecret;
const JWT_EXPIRES_IN = config.jwtExpiresIn;
const jwt = require('jsonwebtoken');

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
}

const handleJwtTokens = async (user) => {
  // Generate JWT token
  const token = createToken({
    id: user._id,
    tokenVersion: user.tokenVersion,
  });

  const refreshToken = await user.createRefreshToken();
  return { token, refreshToken };
};

module.exports = {
  createToken,
  verifyToken,
  handleJwtTokens,
};
