import React from "react";
import ReactDOM from "react-dom/client";
// Load Bootstrap CSS & JS (keeps using Tailwind in index.css)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Load Tailwind + app styles
import './index.css';

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
