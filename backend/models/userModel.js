const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // adjust path if needed

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {               // match frontend field
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',           // default role
    validate: {
      isIn: [['user', 'admin']],    // optional: only allow these roles
    },
  },
}, {
  tableName: 'Users',   // optional: ensure table name
});

module.exports = User;
