const express = require('express');
const router = express.Router();
const Order = require('../model/order');
const { sign, verify } = require('../auth/last');

// Route to render the details form
router.get('/find', (req, res) => {
  let uniqueKey = '';
  const token = req.cookies.users;

  if (token) {
    const decoded = verify(token);
    if (decoded) {
      uniqueKey = decoded.key;
    }
  }

  res.render('details', {
    uniqueKey
  });
});

// Route to handle the form submission and verify the unique key
router.post('/find', async (req, res) => {
  const { uniqueKey } = req.body;

  try {
    // Find the user details
    const users = await Order.find({ UniqueKey: uniqueKey });

    if (users.length > 0) {
      // Sign a JWT token with the uniqueKey and set it as a cookie
      const token = sign({ key: uniqueKey });
      res.cookie('users', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });

      res.json({ success: true, users });
    } else {
      res.json({ success: false, message: 'Invalid Unique Key' });
    }
  } catch (error) {
    console.error("Error verifying unique key:", error);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
  }
});

module.exports = router;
