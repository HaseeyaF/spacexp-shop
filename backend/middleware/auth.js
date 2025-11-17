const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(required = true) {
  return (req,res,next) => {
    const header = req.headers['authorization'];
    if(!header) {
      if(required) return res.status(401).json({ msg: 'Unauthorized' });
      return next();
    }
    const token = header.split(' ')[1];
    if(!token) {
      if(required) return res.status(401).json({ msg: 'Unauthorized' });
      return next();
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch(e) {
      if(required) return res.status(401).json({ msg: 'Invalid token' });
      next();
    }
  };
}

function authorizeRoles(roles = []) {
  return (req,res,next) => {
    if(!req.user) return res.status(401).json({ msg: 'Unauthorized' });
    if(!roles.includes(req.user.role)) return res.status(403).json({ msg: 'Forbidden' });
    next();
  };
}

module.exports = { auth, authorizeRoles };
