const express = require('express');
const routes = express.Router();
const Razorpay = require('razorpay');
const Order = require('../model/order');
const crypto = require('crypto');
const shortid = require('shortid');

const razorpay = new Razorpay({
  key_id: 'rzp_test_pvj558J4PsUVbi', // Directly include your Razorpay key
  key_secret: 'N94GQkYWFa4T3O4t2ikLPPkl', // Directly include your Razorpay secret
});

// Create an order route
routes.post('/order', async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: req.body.amount,
      currency: 'INR',
      receipt: crypto.randomBytes(16).toString('hex'),
      payment_capture: 1,
    });
    res.json({ orderId: order.id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
});

// Payment verification and processing route
routes.post('/payment', async (req, res) => {
  const {
    discordid,
    duser,
    mid,
    amount,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
  } = req.body;

  try {
    // Signature verification
    const generatedSignature = crypto
      .createHmac('sha256', razorpay.key_secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      console.log('Invalid signature');
      return res
        .status(400)
        .json({ success: false, message: 'Invalid signature' });
    }

    // Check if there is already an order with this discordid
    let existingOrder = await Order.findOne({ discordid });

    let uniqueKey;
    if (existingOrder) {
      uniqueKey = existingOrder.UniqueKey; // Use the existing unique key
    } else {
      uniqueKey = shortid.generate()
    }
      // Generate a new unique key using shortid
    

    // Create new order
    const newOrder = await Order.create({
      discordid,
      duser,
      mid,
      amount,
      razorpayPaymentId,
      razorpayOrderId,
      UniqueKey: uniqueKey, // Use the determined unique key
    });

    req.io.emit('payment', {
      discordid,
      duser,
      mid,
      amount,
      razorpayPaymentId,
      razorpayOrderId,
      UniqueKey: uniqueKey,
    });
    console.log('Payment successful');
    res.json({ success: true, uniqueKey });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
  }
});

// Render info route
routes.get('/s', (req, res) => {
  const { discordid, duser, mid, amount, razorpayPaymentId, razorpayOrderId, uniqueKey } = req.query;
  res.render('info', {
    discordid,
    duser,
    mid,
    amount,
    razorpayPaymentId,
    razorpayOrderId,
    uniqueKey,
  });
});

module.exports = routes;
