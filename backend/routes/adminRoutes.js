const express = require("express");
const router = express.Router();
const db = require("../models");
const Task = db.Task;
const User = db.User;
const auth = require("../middleware/authMiddleware");

// auth is the middleware function; authorizeRoles is attached as a property
const authorizeRoles = auth.authorizeRoles || ((...roles) => (req, res, next) => next());

// GET /api/admin/users
router.get("/users", auth, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ["id", "username", "email", "role", "createdAt"] });
    res.json(users);
  } catch (err) {
    console.error("adminRoutes GET /users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/users/:id/tasks
router.get("/users/:id/tasks", auth, authorizeRoles("admin"), async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) return res.status(400).json({ message: "Invalid user id" });
    const tasks = await Task.findAll({ where: { userId } });
    res.json(tasks);
  } catch (err) {
    console.error("adminRoutes GET /users/:id/tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/admin/users/:id
router.delete("/users/:id", auth, authorizeRoles("admin"), async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) {
      await t.rollback();
      return res.status(400).json({ message: "Invalid user id" });
    }

    await Task.destroy({ where: { userId }, transaction: t });
    const deleted = await User.destroy({ where: { id: userId }, transaction: t });
    await t.commit();

    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    await t.rollback();
    console.error("adminRoutes DELETE /users/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
