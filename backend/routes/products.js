const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12, discount } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (discount) {
      filter.discount = { $gte: Number(discount) };
    }

    let sortObj = { createdAt: -1 };
    if (sort === "price_asc") sortObj = { price: 1 };
    else if (sort === "price_desc") sortObj = { price: -1 };
    else if (sort === "rating") sortObj = { ratings: -1 };
    else if (sort === "name") sortObj = { name: 1 };
    else if (sort === "discount") sortObj = { discount: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, pages: Math.ceil(total / Number(limit)), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/bestsellers", async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true }).limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/deals", async (req, res) => {
  try {
    const { minDiscount = 0, maxDiscount = 100, category, limit = 8 } = req.query;
    const filter = {
      discount: { $gte: Number(minDiscount), $lte: Number(maxDiscount) },
    };
    if (category) filter.category = category;
    const products = await Product.find(filter).sort({ discount: -1 }).limit(Number(limit));
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/category-blocks", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    const blocks = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({ category: cat }).limit(4);
        return { category: cat, products };
      })
    );
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
