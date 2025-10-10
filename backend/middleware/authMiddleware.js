// middleware is to protect the routes that require authentication
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

const jwtSecret = (process.env.JWT_SECRET || 'dev_secret').replace(/(^"|"$)/g, '');

async function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  console.log('[backend auth] Authorization header:', authHeader);

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.warn('[backend auth] Missing/malformed Authorization header');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findByPk(payload.id, { attributes: ['id', 'email', 'username', 'role'] });
    if (!user) {
      console.warn('[backend auth] user not found for token payload', payload);
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = { id: user.id, email: user.email, username: user.username, role: user.role };
    next();
  } catch (err) {
    console.error('[backend auth] token verify error:', err && err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

module.exports = { auth, authorizeRoles };