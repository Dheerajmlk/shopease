const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const { adminAuth } = require("../middleware/auth");
const multer = require("multer");

const router = express.Router();

// Try Cloudinary, fall back to memory storage if credentials are wrong
let upload;
try {
  const { upload: cloudUpload } = require("../config/cloudinary");
  upload = cloudUpload;
} catch {
  upload = multer({ storage: multer.memoryStorage() });
}

const tryCloudinaryUpload = async (file) => {
  try {
    const { cloudinary } = require("../config/cloudinary");
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "ecommerce-products", transformation: [{ width: 800, height: 800, crop: "limit" }] },
        (err, result) => { if (err) reject(err); else resolve(result); }
      );
      stream.end(file.buffer);
    });
  } catch {
    return null;
  }
};

// ─── Dashboard ─────────────────────────────────────────────────────────────
router.get("/dashboard", adminAuth, async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, totalRevenue, recentOrders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.aggregate([
        { $match: { status: { $nin: ["cancelled", "returned"] } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.find().populate("user", "name email").sort({ createdAt: -1 }).limit(5),
    ]);
    res.json({ totalProducts, totalOrders, totalUsers, totalRevenue: totalRevenue[0]?.total || 0, recentOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Products CRUD ─────────────────────────────────────────────────────────
router.get("/products", adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/products", adminAuth, multer({ storage: multer.memoryStorage() }).single("image"), async (req, res) => {
  try {
    const { name, description, price, originalPrice, discount, category, stock, isFeatured, isBestSeller, imageUrl } = req.body;

    let image = imageUrl || "";
    let imagePublicId = "";

    // Try Cloudinary upload if file provided
    if (req.file) {
      try {
        const { cloudinary } = require("../config/cloudinary");
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "ecommerce-products", transformation: [{ width: 800, height: 800, crop: "limit" }] },
            (err, r) => { if (err) reject(err); else resolve(r); }
          );
          stream.end(req.file.buffer);
        });
        image = result.secure_url;
        imagePublicId = result.public_id;
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr.message);
        if (!imageUrl) {
          return res.status(400).json({ message: "Image upload failed. Please use an Image URL instead. Cloudinary error: " + uploadErr.message });
        }
      }
    }

    if (!image) return res.status(400).json({ message: "Either upload an image or provide an Image URL" });

    const product = await Product.create({
      name, description,
      price: Number(price),
      originalPrice: Number(originalPrice) || 0,
      discount: Number(discount) || 0,
      category, stock: Number(stock),
      isFeatured: isFeatured === "true" || isFeatured === true,
      isBestSeller: isBestSeller === "true" || isBestSeller === true,
      image, imagePublicId,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/products/:id", adminAuth, multer({ storage: multer.memoryStorage() }).single("image"), async (req, res) => {
  try {
    const { name, description, price, originalPrice, discount, category, stock, isFeatured, isBestSeller, imageUrl } = req.body;
    const update = {
      name, description,
      price: Number(price),
      originalPrice: Number(originalPrice) || 0,
      discount: Number(discount) || 0,
      category, stock: Number(stock),
      isFeatured: isFeatured === "true" || isFeatured === true,
      isBestSeller: isBestSeller === "true" || isBestSeller === true,
    };

    if (req.file) {
      try {
        const { cloudinary } = require("../config/cloudinary");
        const old = await Product.findById(req.params.id);
        if (old?.imagePublicId) {
          try { await cloudinary.uploader.destroy(old.imagePublicId); } catch {}
        }
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "ecommerce-products", transformation: [{ width: 800, height: 800, crop: "limit" }] },
            (err, r) => { if (err) reject(err); else resolve(r); }
          );
          stream.end(req.file.buffer);
        });
        update.image = result.secure_url;
        update.imagePublicId = result.public_id;
      } catch (uploadErr) {
        if (!imageUrl) {
          return res.status(400).json({ message: "Image upload failed. Please use an Image URL instead." });
        }
      }
    }

    if (imageUrl && !req.file) {
      update.image = imageUrl;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/products/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.imagePublicId) {
      try {
        const { cloudinary } = require("../config/cloudinary");
        await cloudinary.uploader.destroy(product.imagePublicId);
      } catch {}
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Orders management ─────────────────────────────────────────────────────
router.get("/orders", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/orders/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate("user", "name email").populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Users management ─────────────────────────────────────────────────────
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ message: "Cannot delete admin" });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
