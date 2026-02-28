const express = require("express");
const router = express.Router();
const Order = require("../model/order");
const Admin = require("../model/admin");
const { login } = require("../auth/login");
const { isAuthenticated, loginauth } = require("../middle/login");

/* ================= ADMIN ROUTES ================= */

// Get all orders
router.get("/admin", isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
});

// Delete order
router.delete("/admin/:id", isAuthenticated, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting order"
    });
  }
});

// Edit order
router.put("/admin/:id", isAuthenticated, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order"
    });
  }
});

/* ================= AUTH ROUTES ================= */

// Login (API style)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email, password });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = login({ id: admin._id, email: admin.email });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

// Verify token
router.get("/verify", loginauth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token verified"
  });
});

// Logout (API style)
router.post("/logout", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});

module.exports = router;
