const mongoose = require('mongoose');
const orderSchem = new mongoose.Schema({
  discordid: {
    type: String,
    required: true,
  },
  duser: {
    type: String,
    required: true,
  },
  mid: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  isPlayed: {
    type: Boolean,
    default: false,
  },
  UniqueKey: {
    type: String,
    required: true,
  }
})
module.exports = mongoose.model('order', orderSchem)
