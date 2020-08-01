const jwt = require('jsonwebtoken');

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

async function getToken(payload) {
  const token = await jwt.sign(payload, PRIVATE_KEY);
  return token;
}

async function verifyToken(token) {
  let payload = {};
  payload = await jwt.verify(token, PRIVATE_KEY);
  return payload;
}

module.exports = {
  getToken,
  verifyToken,
};
