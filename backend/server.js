require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { sequelize } = require('./config/db');
// initialize models
const db = require('./models');

const authRoutes = require('./routes/auth');
const tasksRouter = require('./routes/tasks');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));

// mount routers
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRouter);
app.use('/api/admin', adminRoutes);

// JSON 404 fallback
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err?.stack || err);
  res.status(500).json({ error: err?.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      // list mounted routes for debugging
      try {
        app._router.stack.forEach((layer) => {
          if (layer.route && layer.route.path) {
            const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
            console.log(`${methods} ${layer.route.path}`);
          } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
            layer.handle.stack.forEach((r) => {
              if (r.route && r.route.path) {
                const methods = Object.keys(r.route.methods).join(',').toUpperCase();
                console.log(`${methods} ${r.route.path}`);
              }
            });
          }
        });
      } catch (e) {}
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();