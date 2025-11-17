const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, authorizeRoles } = require('../middleware/auth');

// POST create product (admin/content)
router.post('/', auth(true), authorizeRoles(['admin','content']), async (req,res,next) => {
  try {
    const data = req.body;
    if(!data.name) return res.status(400).json({ error: 'name required' });
    // create slug
    data.slug = (data.name || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    const p = new Product(data);
    await p.save();
    res.json(p);
  } catch(err) { next(err); }
});

// GET list with filters & pagination & search
router.get('/', async (req,res,next) => {
  try {
    const {
      page = 1, limit = 20, sort, category, brand,
      minPrice, maxPrice, colors, sizes, rating, inStock, search, isDeal, tag
    } = req.query;
    const filter = {};
    if(category) filter.category = category;
    if(brand) filter.brand = brand;
    if(tag) filter.tags = tag;
    // price filter across variants (simple)
    if(minPrice || maxPrice) {
      filter.$or = [{ basePrice: {} }, { 'variants.price': {} }];
      // simpler approach: if min/max provided, we filter variants in-memory after query (safer)
    }
    if(isDeal !== undefined) filter.isDeal = isDeal === 'true';
    if(search) {
      const re = new RegExp(search, 'i');
      filter.$or = (filter.$or || []).concat([{ name: re }, { description: re }, { brand: re }, { tags: re }]);
    }

    let query = Product.find(filter);

    if(sort) {
      if(sort === 'price_asc') query = query.sort({ basePrice: 1 });
      else if(sort === 'price_desc') query = query.sort({ basePrice: -1 });
      else if(sort === 'newest') query = query.sort({ createdAt: -1 });
      else if(sort === 'best_selling') query = query.sort({ totalSold: -1 });
    }

    const total = await Product.countDocuments(filter);
    const data = await query.skip((Number(page)-1)*Number(limit)).limit(Number(limit));
    // optional: filter by minPrice/maxPrice/colors etc in-memory for variants
    let results = data.map(d => d.toObject());
    if(minPrice || maxPrice || colors || sizes) {
      results = results.filter(prod => {
        let ok = false;
        for(const v of (prod.variants || [])) {
          if(colors) {
            const colorList = colors.split(',');
            if(!colorList.includes(v.color)) continue;
          }
          if(sizes) {
            const sizeList = sizes.split(',');
            if(!v.sizes || !v.sizes.some(s => sizeList.includes(s.sizeLabel))) continue;
          }
          if(minPrice && v.price < Number(minPrice)) continue;
          if(maxPrice && v.price > Number(maxPrice)) continue;
          ok = true; break;
        }
        return ok || ((minPrice||maxPrice) && prod.basePrice && ((minPrice?prod.basePrice>=minPrice:true) && (maxPrice?prod.basePrice<=maxPrice:true)));
      });
    }

    res.json({ data: results, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch(err){ next(err); }
});

// GET /:id or /slug
router.get('/:id', async (req,res,next) => {
  try {
    const id = req.params.id;
    const p = await Product.findOne({ $or: [{ _id: id }, { slug: id }] });
    if(!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  } catch(err){ next(err); }
});

// PUT update product
router.put('/:id', auth(true), authorizeRoles(['admin','content']), async (req,res,next) => {
  try {
    const p = await Product.findById(req.params.id);
    if(!p) return res.status(404).json({ error: 'not found' });
    Object.assign(p, req.body);
    if(req.body.name) p.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    await p.save();
    res.json(p);
  } catch(err){ next(err); }
});

// DELETE product
router.delete('/:id', auth(true), authorizeRoles(['admin']), async (req,res,next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch(err){ next(err); }
});

module.exports = router;
