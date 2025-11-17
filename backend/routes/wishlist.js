const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { auth } = require('../middleware/auth');

// GET /?userId=...
router.get('/', async (req,res) => {
  const userId = req.query.userId || req.user?.id;
  if(!userId) return res.status(400).json({ error: 'userId required' });
  const w = await Wishlist.findOne({ userId }).populate('products');
  if(!w) return res.json({ products: [] });
  res.json(w);
});

// POST /toggle
router.post('/toggle', async (req,res) => {
  const { userId, productId } = req.body;
  if(!userId || !productId) return res.status(400).json({ error: 'userId & productId required' });
  let w = await Wishlist.findOne({ userId });
  if(!w) {
    w = new Wishlist({ userId, products: [productId] });
    await w.save();
    await w.populate('products');
    return res.json(w);
  }
  const exists = w.products.find(p => p.toString() === productId);
  if(exists) w.products = w.products.filter(p => p.toString() !== productId);
  else w.products.push(productId);
  await w.save();
  await w.populate('products');
  res.json(w);
});

module.exports = router;
