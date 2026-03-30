const express = require("express");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Get profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update profile (name, phone)
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all addresses
router.get("/addresses", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses");
    res.json(user.addresses || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new address
router.post("/addresses", auth, async (req, res) => {
  try {
    const { label, street, city, state, zip, isDefault } = req.body;
    if (!street || !city || !state || !zip) {
      return res.status(400).json({ message: "All address fields are required" });
    }
    const user = await User.findById(req.user._id);
    const makeDefault = isDefault || user.addresses.length === 0;
    if (makeDefault) user.addresses.forEach((a) => (a.isDefault = false));
    user.addresses.push({ label: label || "Home", street, city, state, zip, isDefault: makeDefault });
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an address
router.put("/addresses/:id", auth, async (req, res) => {
  try {
    const { label, street, city, state, zip, isDefault } = req.body;
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ message: "Address not found" });
    if (isDefault) user.addresses.forEach((a) => (a.isDefault = false));
    if (label !== undefined) addr.label = label;
    if (street !== undefined) addr.street = street;
    if (city !== undefined) addr.city = city;
    if (state !== undefined) addr.state = state;
    if (zip !== undefined) addr.zip = zip;
    if (isDefault !== undefined) addr.isDefault = isDefault;
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Set address as default
router.put("/addresses/:id/default", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.forEach((a) => (a.isDefault = a._id.toString() === req.params.id));
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an address
router.delete("/addresses/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ message: "Address not found" });
    const wasDefault = addr.isDefault;
    addr.deleteOne();
    // If deleted was default, set first remaining as default
    if (wasDefault && user.addresses.length > 0) user.addresses[0].isDefault = true;
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
