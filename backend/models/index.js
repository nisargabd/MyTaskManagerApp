const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// User model
const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' },
  },
  { tableName: 'users', timestamps: true }
);

const Task = sequelize.define(
  'Task',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'todo' },
    userId: { type: DataTypes.INTEGER, allowNull: true },
  },
  { tableName: 'Tasks', timestamps: true }
);

// Associations
User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

db.User = User;
db.Task = Task;

module.exports = db;