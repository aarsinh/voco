import React from 'react';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoutes';
import { GuestRoutes } from './components/GuestRoutes';
import { Login } from './Login';
import { Signup } from './Signup';
import NGO from './components/ngo/dashboard'
import Volunteer from './components/volunteer/Dashboard';
import './index.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<GuestRoutes />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['ngo']} />}>
        <Route path="/ngo" element={<NGO />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['volunteer']} />}>
        <Route path="/volunteer" element={<Volunteer />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
