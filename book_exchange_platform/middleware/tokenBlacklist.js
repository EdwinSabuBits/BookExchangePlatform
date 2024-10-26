const jwt = require('jsonwebtoken');
const blacklistedTokens = new Set();

const blacklistToken = (token) => {
  blacklistedTokens.add(token);
};

const checkBlacklistedToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token && blacklistedTokens.has(token)) {
    return res.status(401).json({ message: 'Token is blacklisted' });
  }
  next();
};

module.exports = { blacklistToken, checkBlacklistedToken };
