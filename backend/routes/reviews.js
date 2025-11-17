const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// POST create review (auth optional but recommended)
router.post('/', auth(false), async (req,res,next) => {
  try {
    const { productId, name, rating, comment } = req.body;
    if(!productId || rating == null) return res.status(400).json({ error: 'productId & rating required' });
    const review = new Review({ productId, name, rating: Number(rating), comment, userId: req.user?.id });
    await review.save();

    const agg = await Review.aggregate([
      { $match: { productId: review.productId } },
      { $group: { _id: "$productId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);
    if(agg.length) {
      await Product.findByIdAndUpdate(productId, { rating: agg[0].avgRating, totalRatings: agg[0].count });
    }
    res.json({ success:true, review });
  } catch(err){ next(err); }
});

// GET /?productId=
router.get('/', async (req,res,next) => {
  try {
    const { productId } = req.query;
    if(!productId) return res.status(400).json({ error: 'productId required' });
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch(err){ next(err); }
});

module.exports = router;
