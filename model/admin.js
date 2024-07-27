const mongoose = require('mongoose');

const login = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    default: 'apna@sapna.com'
  },
  password: {
    type: String,
    required: true,
    default: 'apna@sapna.com'
  }
})
module.exports = mongoose.model('login', login)