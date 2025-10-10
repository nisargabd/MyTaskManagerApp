// middleware is to protect the routes that require authentication
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

const jwtSecret = (process.env.JWT_SECRET || 'dev_secret').replace(/(^"|"$)/g, '');

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  if (!auth) return res.status(401).json({ message: 'No token' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid token' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findByPk(payload.id, { attributes: ['id','email','username','role'] });
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = { id: user.id, email: user.email, username: user.username, role: user.role };
    next();
  } catch (err) {
    console.error('authMiddleware error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ message: 'Access denied' });
    next();
  };
}

module.exports = authMiddleware;

module.exports.authorizeRoles = authorizeRoles;module.exports.authorizeRoles = authorizeRoles;