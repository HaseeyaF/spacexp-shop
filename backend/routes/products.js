const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const {
      page = 1, limit = 20,
      sort, category, brand,
      minPrice, maxPrice, colors, sizes,
      rating, inStock, search, isDeal,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (colors) filter.colors = { $in: colors.split(",") };
    if (sizes) filter.sizes = { $in: sizes.split(",") };
    if (rating) filter.rating = { $gte: Number(rating) };
    if (inStock !== undefined) filter.inStock = inStock === "true";
    if (isDeal !== undefined) filter.isDeal = isDeal === "true";

    if (search) {
      const re = new RegExp(search, "i");
      filter.$or = [{ name: re }, { description: re }, { brand: re }];
    }
    let query = Product.find(filter);

    if (sort) {
      if (sort === "price_asc") query = query.sort({ price: 1 });
      else if (sort === "price_desc") query = query.sort({ price: -1 });
      else if (sort === "newest") query = query.sort({ createdAt: -1 });
      else if (sort === "best_selling") query = query.sort({ totalSold: -1 });
    }

    const total = await Product.countDocuments(filter);
    
    const data = await query
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id => product + reviews fetched on frontend separately if needed
router.get("/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Product not found" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
