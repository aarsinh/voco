import React from 'react';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'

import Dashboard from './components/volunteer/Dashboard';

const router = createBrowserRouter([
  {path: "/", element: <Dashboard />},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
