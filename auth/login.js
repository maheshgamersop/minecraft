const jwt = require('jsonwebtoken');

function login(payload) {
  try {
    const token = jwt.sign(payload, "maheshisthebestboy");
    return token;
  } catch (error) {
    console.error("Error signing token from file login.js");
    return null;
  }
}

function check(token) {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token, "maheshisthebestboy");
    
    return decoded;
  } catch (error) {
    console.error("INVALID TOKEN... login.js");
    return null;
  }
}

module.exports = {
  login,
  check
};
