require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');  

const {connectDB,sequelize} = require('./config/db');
require('./models/task.model'); // Importing the Task model to ensure it's registered with Sequelize
// importing routes
const tasksRouter = require('./routes/tasks');

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));  // Use morgan for logging(debugging)

app.use('/tasks',tasksRouter)

// default route
app.get('/',(req,res)=>{
    res.send('Task Management Application is running...');
})

// global error  handler
app.use((err,res,req,next) =>{
    console.error("Error:", err.message);
    // res.status(500).send('Something went wrong!');
    res.status(500).json({ error: err.message });

});

const PORT = process.env.PORT || 5000;
(async ()=>{
    await connectDB();
    await sequelize.sync({alter:true}); // Ensure all defined models are synchronized with the database creates tables if not exists
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    }); 
})();
                                                                                          


