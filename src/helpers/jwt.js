const jwt = require('jsonwebtoken');

function generateToken(payload) {
  return jwt.sign(payload, 'blackpink');
}

function verifyToken(token) {
  return jwt.verify(token, 'blackpink');
}

module.exports = {
  generateToken,
  verifyToken,
}