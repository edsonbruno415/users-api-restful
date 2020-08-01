const bcrypt = require('bcrypt');

async function createHash(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function compare(password, hash) {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
}

module.exports = {
  createHash,
  compare,
};
