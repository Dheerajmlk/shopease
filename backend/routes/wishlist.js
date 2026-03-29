const express = require("express");
const Wishlist = require("../models/Wishlist");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    if (!wishlist) wishlist = { products: [] };
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/toggle", auth, async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
    } else {
      const idx = wishlist.products.indexOf(productId);
      if (idx > -1) {
        wishlist.products.splice(idx, 1);
      } else {
        wishlist.products.push(productId);
      }
      await wishlist.save();
    }

    wishlist = await Wishlist.findById(wishlist._id).populate("products");
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
