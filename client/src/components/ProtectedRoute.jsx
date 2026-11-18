import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute() {
  const { user, loading, loggedOut } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to={loggedOut ? '/' : '/login'} replace />;
  return <Outlet />;
}
