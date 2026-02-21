import React from 'react';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Login } from './Login';
import { Signup } from './Signup';
import './index.css'

import Dashboard from './components/Dashboard';

const router = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> }


]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
