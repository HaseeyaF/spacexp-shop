const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');
const { auth, authorizeRoles } = require('../middleware/auth');

// helper: compute MD5 verify
function verifyPayHereMd5(body, merchantSecret) {
  const { merchant_id='', order_id='', payhere_amount='', payhere_currency='', status_code='', md5sig='' } = body;
  const innerHash = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
  const concat = merchant_id + order_id + payhere_amount + payhere_currency + status_code + innerHash;
  const localMd5 = crypto.createHash('md5').update(concat).digest('hex').toUpperCase();
  return localMd5 === (md5sig || '').toUpperCase();
}

// create order
router.post('/create', auth(true), async (req,res) => {
  try {
    const { userId, items, subtotal, discount=0, shipping=0, promoCode } = req.body;
    const total = Number((subtotal - discount + shipping).toFixed(2));
    const order = new Order({ userId, items, subtotal, discount, shipping, total, paymentStatus:'pending', promoCode });
    await order.save();
    res.json({ orderId: order._id.toString(), total });
  } catch(err){ res.status(500).json({ error: err.message }); }
});

// payhere notify endpoint
router.post('/payhere-notify', async (req,res) => {
  try {
    const body = req.body;
    if(!verifyPayHereMd5(body, process.env.PAYHERE_MERCHANT_SECRET)) return res.status(400).send('Invalid signature');
    const o = await Order.findById(body.order_id);
    if(!o) return res.status(404).send('Order not found');
    const status = parseInt(body.status_code, 10);
    o.paymentStatus = status === 2 ? 'paid' : (status === 0 ? 'pending' : 'failed');
    o.payherePaymentId = body.payment_id;
    await o.save();
    res.sendStatus(200);
  } catch(e){ console.error(e); res.status(500).send('error'); }
});

// admin: list orders
router.get('/', auth(true), authorizeRoles(['admin','sales']), async (req,res) => {
  const orders = await Order.find().sort({ createdAt:-1 }).limit(200);
  res.json(orders);
});

// update order status
router.put('/:id/status', auth(true), authorizeRoles(['admin','sales']), async (req,res) => {
  const { status } = req.body;
  const o = await Order.findById(req.params.id);
  if(!o) return res.status(404).json({ error: 'Order not found' });
  o.orderStatus = status;
  await o.save();
  res.json({ success:true });
});

module.exports = router;
