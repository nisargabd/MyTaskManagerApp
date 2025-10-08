const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
            

// Read - GET /tasks
router.get('/tasks',async (req, res) => {
    try {
        const tasks = await Task.findAll({order:[['createdAt','DESC']]});    
        res.json(tasks);
    }   catch (err) {                   
        res.status(500).json({ message: err.message });         
    }
});

// Read single task - get /tasks/:id
router.get('/:id',async(req,res)=>{
    try{
        const task = await Task.findByPk(req.params.id);
        if(!task){
            return res.status(404).json({error:"Task not found"});
        }
        res.json(task);
    }catch(err){
        console.error("Error fetching task:", err.message);
        res.status(500).json({error:"Internal Server Error"});  
}
})
// CREATE - POST /tasks
router.post('/',async(req,res)=>{
    try{
        const{title,description,status}=req.body;
        if(!title){
            return res.status(400).json({message:"Title is required"});
        }   

        const newTask = await Task.create({title,description,status});
        res.status(201).json(newTask);  

    }catch(err){
        console.error("Error creating task:", err.message);
        res.status(500).json({error:"Internal Server Error"});
    }
})

// UPDATE : PUT - /tasks/:id
router.put('/:id',async(req,res)=>{
    try{
        const{title,description,status} = req.body;
        const task = await Task.findByPk(req.params.id);
        if(!task){
            // console.error("Task not found for update:", req.params.id);
            return res.status(404).json({error:"Task not found"});
        }
        await task.update({title,description,status});
        res.json(task);
    }catch(err){
        // console.error("Error updating task:", err.message);
        res.status(500).json({error:"Internal Server Error"});
    }
});


// DELETE - DELETE /tasks/:id
router.delete('/:id',async(req,res)=>{
    try{

        const task = await Task.findByPk(req.params.id);
        if(!task){
            // console.error("Task not found for deletion:", req.params.id);
            return res.status(404).json({error:"Task not found"});
        }
        await task.destroy();
        res.json({message:"Task deleted successfully"});
    }catch(err){
        // console.error("Error deleting task:", err.message);
        res.status(500).json({error:"Internal Server Error"});
    }
});

module.exports = router;