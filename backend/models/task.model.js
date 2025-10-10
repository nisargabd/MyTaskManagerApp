const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/db');    
const User = require("./userModel");

const Task = sequelize.define(
    'Task',
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,    
        },
        title:{
            type: DataTypes.STRING,
            allowNull: false,   
        },
        description:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        status:{
            type: DataTypes.ENUM('todo','in-progress','done'),
            defaultValue: 'todo'
        },
    },{
        timestamps: true, 
        // this adds createdAt and updatedAt fields automatically

    }

);
User.hasMany(Task, { foreignKey: "userId", onDelete: "CASCADE" });
Task.belongsTo(User, { foreignKey: "userId" });

module.exports = Task;