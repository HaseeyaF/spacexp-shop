const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

// authorize() logic as in users.js
function authorize(roles = []) {
  return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!roles.includes(decoded.role))
        return res.status(403).json({ msg: "Forbidden" });
      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ msg: "Invalid token" });
    }
  };
}

function verifyPayHereMd5(body, merchantSecret) {
  const {
    merchant_id = "",
    order_id = "",
    payhere_amount = "",
    payhere_currency = "",
    status_code = "",
    md5sig = "",
  } = body;

  const innerHash = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase();

  const concat =
    merchant_id +
    order_id +
    payhere_amount +
    payhere_currency +
    status_code +
    innerHash;

  const localMd5 = crypto
    .createHash("md5")
    .update(concat)
    .digest("hex")
    .toUpperCase();
  return localMd5 === (md5sig || "").toUpperCase();
}

// CREATE ORDER — for customers
router.post("/create", authorize(["customer", "admin"]), async (req, res) => {
  try {
    const { userId, items, subtotal, discount = 0, shipping = 0 } = req.body;
    const total = subtotal - discount + shipping;

    if (req.user.role === "customer" && req.user.id !== userId) {
      return res
        .status(403)
        .json({ msg: "You can only create orders for your own account" });
    }

    const order = new Order({
      userId,
      items,
      subtotal,
      discount,
      shipping,
      total,
      paymentStatus: "pending",
    });
    await order.save();

    res.json({ orderId: order._id, total });
  } catch (err) {
    res.status(500).json({ msg: "Error creating order" });
  }
});

// GET ALL ORDERS — only for admin or sales
router.get("/", authorize(["admin", "sales"]), async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email role");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching orders" });
  }
});

// GET ORDERS BY USER — customers see their own
router.get("/my-orders", authorize(["customer", "admin", "sales"]), async (req, res) => {
  try {
    const filter =
      req.user.role === "customer" ? { userId: req.user.id } : {};
    const orders = await Order.find(filter).populate("userId", "name email role");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching orders" });
  }
});

// PAYHERE NOTIFY — public (no token)
router.post("/payhere-notify", async (req, res) => {
  try {
    const body = req.body;

    if (!verifyPayHereMd5(body, process.env.PAYHERE_MERCHANT_SECRET))
      return res.status(400).send("Invalid signature");
    
    const o = await Order.findById(body.order_id);
    if (!o) return res.status(404).send("Order not found");
    
    const status = parseInt(body.status_code, 10);
    o.paymentStatus =
      status === 2 ? "paid" : status === 0 ? "pending" : "failed";
    o.payherePaymentId = body.payment_id;
    await o.save();
    
    res.sendStatus(200);
  } catch (e) {
    res.status(500).send("error");
  }
});

module.exports = router;
