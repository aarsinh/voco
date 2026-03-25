import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  allowedRoles: Array<'ngo' | 'volunteer'>
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation()
  if (isLoading) {
    return <div>Checking authentication status...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />
  }

  if (!allowedRoles.includes(role!)) {
    return <Navigate to={role === 'ngo' ? '/ngo' : '/volunteer'} replace />
  }

  return <Outlet />
}
