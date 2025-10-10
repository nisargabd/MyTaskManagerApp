// ...existing code...
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { sequelize } = require('./config/db');
require('./models/task.model'); // ensure Task model is registered

// importing routes
const tasksRouter = require('./routes/tasks');
const authRoutes = require('./routes/authRoutes'); // adjust to './routes/authRoutes' if your file is named authRoutes.js

const app = express();

// middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // React dev server
  credentials: true
}));
app.use(morgan('dev'));

app.use('/api', tasksRouter);
app.use('/api/auth', authRoutes);

// default route
app.get('/', (req, res) => {
  res.send('Task Management Application is running...');
});

// global error handler (err, req, res, next)
app.use((err, req, res, next) => {
  console.error('Error:', err?.message || err);
  res.status(500).json({ error: err?.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.sync({ alter: true }); // sync models with DB
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
// ...existing code...