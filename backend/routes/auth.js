const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

router.post('/register', async (req,res) => {
  try {
    const { name, email, password, role } = req.body;
    if(!email || !password) return res.status(400).json({ msg: 'email & password required' });
    if(await User.findOne({ email })) return res.status(400).json({ msg: 'Email exists' });
    const hash = await bcrypt.hash(password, 10);
    const u = new User({ name, email, passwordHash: hash, role });
    await u.save();
    res.json({ success: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.post('/login', async (req,res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
