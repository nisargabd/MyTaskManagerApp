// backend/controllers/tasks.controller.js
const Task = require("../models/task.model");

// ==========================
// 🧠 Create a new task (User-Specific)
// ==========================
exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    // Link the task to the logged-in user
    const newTask = await Task.create({
      title,
      description,
      status,
      // userId: req.user.id, // userId from auth middleware
    });

    return res.status(201).json(newTask);
  } catch (err) {
    console.error("createTask error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ==========================
// 📋 Get all tasks for logged-in user
// ==========================
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.json(tasks);
  } catch (err) {
    console.error('getAllTasks error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// ==========================
// 🔍 Get one task by ID (User-Specific Access)
// ==========================
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) return res.status(404).json({ error: "Task not found" });

    // Ensure user owns the task (security check)
    if (task.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    return res.json(task);
  } catch (err) {
    console.error("getTaskById error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ==========================
// ✏️ Update a task (User-Specific)
// ==========================
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Ensure only owner can update
    if (task.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();
    return res.json(task);
  } catch (err) {
    console.error("updateTask error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ==========================
// ❌ Delete task (User-Specific)
// ==========================
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) return res.status(404).json({ error: "Task not found" });

    // Ensure only owner can delete
    if (task.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    await task.destroy();
    return res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("deleteTask error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
