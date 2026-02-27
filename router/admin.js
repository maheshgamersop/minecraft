const express = require("express");
const router = express.Router();
const Order = require("../model/order");
const Admin = require("../model/admin");
const { login } = require("../auth/login");
const { isAuthenticated, loginauth } = require("../middle/login");

// Admin page route
router.get('/admin', isAuthenticated, async (req, res) => {
  try {
    console.log(req.headers.check)
    const data = await Order.find();
    res.render('admin', { data });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Something went wrong!");
  }
});

// Delete order route
router.delete('/admin/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false });
  }
});

// Login routes
router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/verify', loginauth, (req, res) => {
  console.log('verified')
  res.status(404).send("404")
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email, password });
    if (admin) {
      const token = login({ id: admin._id, email: admin.email });
      res.cookie('token', token, { httpOnly: true, sameSite: 'Strict' });
      res.redirect('/lock/admin');
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Something went wrong!");
  }
});

// Logout route
router.get('/logout', (req, res) => {
  res.clearCookie('token'); // Match the cookie name here
  res.redirect('/lock/login');
});

// Edit order route
router.post('/admin/edit', isAuthenticated, async (req, res) => {
  const { _id, mid, discordid, isPlayed } = req.body;

  try {
    // Fetch the existing order
    const existingOrder = await Order.findById(_id);
    if (!existingOrder) {
      return res.status(404).send("Order not found.");
    }

    // Set defaults if fields are missing
    const updatedMid = mid || existingOrder.mid;
    const updatedDiscordid = discordid || existingOrder.discordid;
    const updatedIsPlayed = (isPlayed !== undefined) ? isPlayed : existingOrder.isPlayed;

    await Order.findOneAndUpdate(
      { _id },
      { mid: updatedMid, discordid: updatedDiscordid, isPlayed: updatedIsPlayed },
      { new: true }
    );
    res.status(200).send("Order has been updated")
    //res.redirect('/lock/admin');
  } catch (error) {
    console.error("Error updating order:", error);
    /*res.status(500).render('admin', {
      data: await Order.find(),
      message: "Are you setting the isPlayed to a String? Please set it to a boolean value (true or false)."
    });*/
  }
});

module.exports = router;
