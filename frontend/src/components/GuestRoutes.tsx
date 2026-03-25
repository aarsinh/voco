import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const GuestRoutes: React.FC = () => {
  const { isAuthenticated, isLoading, role } = useAuth()
  if (isLoading) {
    return <div>Checking authentication status...</div>
  }

  if (!isAuthenticated) {
    return <Outlet />
  } else {
    return <Navigate to={role === 'ngo' ? '/ngo' : '/volunteer'} replace />
  }
}

