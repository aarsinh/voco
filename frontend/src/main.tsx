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
import NGO from './components/ngo/Homepage'
import Volunteer from './components/volunteer/HomePage';
import VolunteerProfile from './components/volunteer/profile';
import './index.css'
import Profile from './components/ngo/profile';

import axios from "axios";
axios.defaults.withCredentials = true;

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
          <Route path="/ngo/volunteerList/:projectId" element={<VolunteerList />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={['volunteer']} />}>
        <Route element={<ProtectedLayoutContent />}>
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/volunteer/profile" element={<VolunteerProfile />} />
          <Route path="/volunteer/project/:projectId/volunteers" element={<VolunteerList />} />
          <Route path="/volunteer/ngo/:id" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={['ngo', 'volunteer']} />}>
        <Route element={<ProtectedLayoutContent />}>
          <Route path="/volunteer/profile" element={<VolunteerProfile />} />
          <Route path="/volunteer/profile/:id" element={<VolunteerProfile />} />
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
