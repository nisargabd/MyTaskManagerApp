import React from "react";
import Dashboard from "./pages/Dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold">Task Management Dashboard</h1>
        </div>
      </header>

      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
