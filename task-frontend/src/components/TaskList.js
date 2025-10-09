import React from "react";

const statusClass = {
  "todo": "bg-gray-100 text-gray-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  "done": "bg-green-100 text-green-800",
};

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  return (
    <div className="grid gap-6">
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available. Add some tasks to get started.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200 p-5"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                <p className="mt-2 text-gray-600">{task.description}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass[task.status]}`}>
                  {task.status.replace("-", " ")}
                </span>
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                  className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => onEdit(task)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;
