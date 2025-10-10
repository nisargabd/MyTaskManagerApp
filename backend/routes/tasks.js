// backend/routes/task.routes.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const Task = db.Task;
const auth = require('../middleware/authMiddleware');

// -------------------------
// Task routes (protected)
// -------------------------

// Get all tasks for admin
router.get("/", auth, async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'admin' && req.query.all === 'true') {
      // admin requesting all tasks
    } else {
      where.userId = req.user.id;
    }
    const tasks = await Task.findAll({ where });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single task by id
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new task
router.post("/", auth, async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.user.id };
    const created = await Task.create(payload);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await task.update(req.body);
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await task.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;