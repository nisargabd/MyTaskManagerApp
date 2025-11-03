// backend/controllers/tasks.controller.js
const db = require('../models');
const Task = db.Task;

// ✅ Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required' });

    // Attach the logged-in user ID from auth middleware
    const newTask = await Task.create({
      title,
      description,
      status: status || 'pending',
      userId: req.user.id,
    });

    return res.status(201).json(newTask);
  } catch (err) {
    console.error('createTask error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};


// ✅ Get all tasks (for the logged-in user)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id }, // only fetch tasks of logged-in user
      order: [['createdAt', 'DESC']],
    });
    return res.json(tasks);
  } catch (err) {
    console.error('getAllTasks error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// ✅ Get one task
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: { id, userId: req.user.id }, // only allow owner to access
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.json(task);
  } catch (err) {
    console.error('getTaskById error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// ✅ Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();
    return res.json(task);
  } catch (err) {
    console.error('updateTask error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// ✅ Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    await task.destroy();
    return res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('deleteTask error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};
