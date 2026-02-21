import React from 'react';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'

// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";

import ShowProjectList from './components/ShowProjList';
import { Login } from './Login';
import { Signup } from './Signup';

const router = createBrowserRouter([
  { path: "/", element: <ShowProjectList /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> }

]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
