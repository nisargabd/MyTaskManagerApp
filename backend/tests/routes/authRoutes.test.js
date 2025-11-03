const request = require('supertest');
const express = require('express');
const taskRoutes = require('../../routes/tasks');
const db = require('../../models');
const {auth} = require('../../middleware/authMiddleware');

jest.mock('../../models');
jest.mock('../../middleware/authMiddleware',() => ({

auth : (req, res, next) => {
  req.user = { id: 1, role: 'user' }; // Mocked user
    next(); 
},
}));

const app = express();
app.use(express.json());
app.use('/api/tasks', auth, taskRoutes);

describe('Task Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });  
  
  it('GET / should return tasks', async () => {
    db.Task.findAndCountAll.mockResolvedValue({ count: 1, rows: [{ id: 1, title: 'Task 1', userId: 1 }] });

    const res = await request(app).get('/api/tasks');

    expect(res.statusCode).toBe(200);
    expect(res.body.tasks).toHaveLength(1);
  });

   it('POST / should create a new task', async () => {
    db.Task.create.mockResolvedValue({ id: 1, title: 'New Task', userId: 1 });

    const res = await request(app).post('/api/tasks').send({ title: 'New Task' });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('New Task');
  });

  it('PUT /:id should update task if owner', async () => {
    const task = { id: 1, title: 'Old', userId: 1, update: jest.fn().mockResolvedValue() };
    db.Task.findByPk.mockResolvedValue(task);

    const res = await request(app).put('/api/tasks/1').send({ title: 'Updated' });

    expect(task.update).toHaveBeenCalledWith({ title: 'Updated' });
    expect(res.statusCode).toBe(200);
  });

  it('DELETE /:id should delete task if owner', async () => {
    const task = { id: 1, userId: 1, destroy: jest.fn().mockResolvedValue() };
    db.Task.findByPk.mockResolvedValue(task);

    const res = await request(app).delete('/api/tasks/1');

    expect(task.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });
  
});