import React from 'react';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PreferencesModalProvider } from './contexts/PreferencesModalContext.tsx';
import { PrivateRoute } from './components/PrivateRoutes';
import { GuestRoutes } from './components/GuestRoutes';
import { ProtectedLayoutContent } from './components/ProtectedLayout';
import { Login } from './Login';
import { Signup } from './Signup';
import VolunteerList from "./components/ngo/volunteerList";
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
        <Route element={<ProtectedLayoutContent />}>
          <Route path="/ngo" element={<NGO />} />
          <Route path="/ngo/volunteers/:projectId" element={<VolunteerList />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={['volunteer']} />}>
        <Route element={<ProtectedLayoutContent />}>
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/volunteer/project/:projectId/volunteers" element={<VolunteerList />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <PreferencesModalProvider>
        <RouterProvider router={router} />
      </PreferencesModalProvider>
    </AuthProvider>
  </React.StrictMode>,
)
