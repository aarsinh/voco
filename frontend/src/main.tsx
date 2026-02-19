import React from 'react';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'

import "bootstrap/dist/css/bootstrap.min.css";

import Dashboard from './components/Dashboard';

const router = createBrowserRouter([
  {path: "/:id", element: <Dashboard />},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
