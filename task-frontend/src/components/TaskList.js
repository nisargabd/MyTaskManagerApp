import React from "react";

const TaskList = ({ tasks, onEdit, onDelete }) => {
  return (
    <div className="task-list">
      <h3>Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="task-item">
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <button onClick={() => onEdit(task)}>Edit</button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;
