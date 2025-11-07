const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Promo = require("../models/Promo");

// ✅ Reuse same authorize function as in users.js
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

// CREATE PROMO — admin or marketing
router.post("/", authorize(["admin", "marketing"]), async (req, res) => {
  try {
    const promo = new Promo(req.body);
    await promo.save();
    res.json({ success: true, promo });
  } catch (err) {
    res.status(500).json({ msg: "Error creating promo" });
  }
});

// GET ALL PROMOS — admin, marketing
router.get("/", authorize(["admin", "marketing"]), async (req, res) => {
  try {
    const promos = await Promo.find();
    res.json(promos);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching promos" });
  }
});

// GET SINGLE PROMO BY CODE — all roles (for validation)
router.get("/:code", authorize(["admin", "marketing", "sales", "customer"]), async (req, res) => {
  try {
    const promo = await Promo.findOne({ code: req.params.code });
    if (!promo) return res.status(404).json({ msg: "Promo not found" });
    res.json(promo);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching promo" });
  }
});

// UPDATE PROMO — admin only
router.put("/:id", authorize(["admin"]), async (req, res) => {
  try {
    const promo = await Promo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promo) return res.status(404).json({ msg: "Promo not found" });
    res.json({ success: true, promo });
  } catch (err) {
    res.status(500).json({ msg: "Error updating promo" });
  }
});

// DELETE PROMO — admin only
router.delete("/:id", authorize(["admin"]), async (req, res) => {
  try {
    await Promo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting promo" });
  }
});

module.exports = router;
