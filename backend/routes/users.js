const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, authorizeRoles } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Admin GET users
router.get('/', auth(true), authorizeRoles(['admin']), async (req,res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
});

// Admin create user
router.post('/create', auth(true), authorizeRoles(['admin']), async (req,res) => {
  const { name,email,password,role } = req.body;
  if(await User.findOne({ email })) return res.status(400).json({ msg:'Email exists' });
  const hash = await bcrypt.hash(password,10);
  const user = new User({ name,email,passwordHash:hash,role });
  await user.save();
  res.json({ success:true });
});

// Admin update
router.put('/:id', auth(true), authorizeRoles(['admin']), async (req,res) => {
  const { name,email,role } = req.body;
  const user = await User.findById(req.params.id);
  if(!user) return res.status(404).json({ msg:'User not found' });
  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  await user.save();
  res.json({ success:true });
});

router.delete('/:id', auth(true), authorizeRoles(['admin']), async (req,res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success:true });
});

module.exports = router;
