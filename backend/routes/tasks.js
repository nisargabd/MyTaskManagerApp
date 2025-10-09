
const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks.controller');

router.post('/', tasksController.createTask);
router.get('/', tasksController.getAllTasks);
router.get('/:id', tasksController.getTaskById);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask); // 👈 this line is failing

module.exports = router;
