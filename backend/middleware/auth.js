const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

function auth(required = true) {
  return async (req, res, next) => {
    const header = req.headers["authorization"];

    if (!header) {
      if (required) return res.status(401).json({ msg: "Unauthorized" });
      return next();
    }

    const token = header.split(" ")[1];
    if (!token) {
      if (required) return res.status(401).json({ msg: "Unauthorized" });
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Load full user including permissions
      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ msg: "User not found" });

      req.user = {
        id: user._id,
        role: user.role,
        permissions: user.permissions,
      };

      next();
    } catch (e) {
      if (required) return res.status(401).json({ msg: "Invalid token" });
      next();
    }
  };
}

// ROLE-BASED AUTH
function authorizeRoles(roles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });

    if (!roles.includes(req.user.role))
      return res.status(403).json({ msg: "Forbidden: Insufficient role" });

    next();
  };
}

// PERMISSION-BASED AUTH
function authorizePermissions(requiredPermissions = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });

    const userPermissions = req.user.permissions || [];

    const hasPermission = requiredPermissions.some(reqPerm => {
      // extract module prefix → product:create → "product"
      const [module] = reqPerm.split(":");

      // If user has wildcard for this module → product:* , order:* , user:* ...
      if (userPermissions.includes(`${module}:*`)) return true;

      // If user has exact permission
      return userPermissions.includes(reqPerm);
    });

    if (!hasPermission)
      return res.status(403).json({ msg: "Forbidden: Missing permissions" });

    next();
  };
}

module.exports = { auth, authorizeRoles, authorizePermissions };
