const express = require('express');
const router = express.Router();
const Promo = require('../models/Promo');
const { auth, authorizePermissions } = require('../middleware/auth');

// create promo (admin/marketing)
router.post( "/", auth(true), authorizePermissions(["promo:create"]),
  async (req, res, next) => {
    try {
      const body = req.body;
      if (!body.code) return res.status(400).json({ error: "code required" });

      body.code = body.code.toUpperCase();
      const p = new Promo(body);
      await p.save();

      res.json(p);
    } catch (err) {
      next(err);
    }
});

// validate promo (customer checkout)
router.post('/validate', async (req,res) => {
  const { code, userId, subtotal } = req.body;
  if(!code) return res.status(400).json({ error: 'code required' });
  
  const promo = await Promo.findOne({ code: code.toUpperCase(), active: true });
  if(!promo) return res.status(404).json({ error: 'Invalid code' });
  
  const now = new Date();
  if(promo.validFrom && promo.validFrom > now) return res.status(400).json({ error: 'Not valid yet' });
  if(promo.validTo && promo.validTo < now) return res.status(400).json({ error: 'Expired' });
  if(promo.maxUses && promo.uses >= promo.maxUses) return res.status(400).json({ error: 'Max uses reached' });
  if(promo.minAmount && subtotal < promo.minAmount) return res.status(400).json({ error: `Minimum amount ${promo.minAmount}` });
  
  let discount = 0;
  if(promo.discountType === 'percent') discount = subtotal * (promo.discountValue / 100);
  else discount = promo.discountValue;
  res.json({ valid: true, discount: Number(discount.toFixed(2)), promo: { code: promo.code } });
});

// list promos (admin)
router.get( "/", auth(true), authorizePermissions(["promo:view"]),
  async (req, res, next) => {
    try {
      const promos = await Promo.find();
      res.json(promos);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
