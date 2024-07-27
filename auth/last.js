const jwt = require('jsonwebtoken');

function sign(payload) {
  try {
    const token = jwt.sign(payload, "maheshisthebestboy");
    return token;
  } catch (error) {
    console.error("Error signing token:", error);
    return null;
  }
}

function verify(token) {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token, "maheshisthebestboy");
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

module.exports = {
  sign,
  verify
};
