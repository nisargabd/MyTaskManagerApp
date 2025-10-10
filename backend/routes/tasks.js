const express = require('express');
const router = express.Router();
const db = require('../models');
const Task = db.Task;
const { auth } = require('../middleware/authMiddleware');

// GET /api/tasks (user tasks; admin can use ?all=true)
router.get('/', auth, async (req, res) => {
  try {
    const where = {};
    if (!(req.user.role === 'admin' && req.query.all === 'true')) where.userId = req.user.id;
    const tasks = await Task.findAll({ where, order: [['createdAt','DESC']] });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    if (task.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    res.json(task);
  } catch (err) {
    console.error('tasks GET/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tasks  -> create a task for req.user
router.post('/', auth, async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      description: req.body.description || null,
      status: req.body.status || 'todo',
      userId: req.user.id, // enforce ownership server-side
    };
    const created = await Task.create(payload);
    res.status(201).json(created);
  } catch (err) {
    console.error('tasks POST error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    if (task.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await task.update(req.body);
    res.json(task);
  } catch (err) {
    console.error('tasks PUT error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/tasks/:id  -> only owner or admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await task.destroy();
    res.status(204).send();
  } catch (err) {
    console.error('tasks DELETE error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
