require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { sequelize } = require('./config/db');

// initialize models (models/index.js)
const db = require('./models');

const authRoutes = require('./routes/auth');
const tasksRouter = require('./routes/tasks');
const adminRouter = require('./routes/admin');

const app = express();

// middlewares
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000',
  'http://localhost:3003'], // React dev server
  credentials: true
}));
app.use(morgan('dev'));

// mount routers
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRouter);
app.use('/api/admin', adminRouter);

// default route
app.get('/', (req, res) => {
  res.send('Task Management Application is running...');
});

// 404 JSON fallback
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err?.stack || err);
  res.status(500).json({ message: err?.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.sync({ alter: true }); // sync models with DB
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();