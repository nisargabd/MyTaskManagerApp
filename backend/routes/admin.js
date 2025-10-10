const express = require('express');
const router = express.Router();
const db = require('../models');
const User = db.User;
const Task = db.Task;
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/users', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'email', 'role', 'createdAt'] });
    res.json(users);
  } catch (err) {
    console.error('admin GET users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users/:id/tasks', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) return res.status(400).json({ message: 'Invalid id' });
    const tasks = await Task.findAll({ where: { userId } });
    res.json(tasks);
  } catch (err) {
    console.error('admin GET user tasks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/users/:id', auth, authorizeRoles('admin'), async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) {
      await t.rollback();
      return res.status(400).json({ message: 'Invalid id' });
    }
    await Task.destroy({ where: { userId }, transaction: t });
    const deleted = await User.destroy({ where: { id: userId }, transaction: t });
    await t.commit();
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    await t.rollback();
    console.error('admin DELETE user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;