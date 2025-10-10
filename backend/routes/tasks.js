
const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks.controller');

router.post('/tasks', tasksController.createTask);
router.get('/tasks', tasksController.getAllTasks);
router.get('/tasks/:id', tasksController.getTaskById);
router.put('/tasks/:id', tasksController.updateTask);
router.delete('/tasks/:id', tasksController.deleteTask); // 👈 this line is failing

module.exports = router;
