import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // Or a spinner

  // If no token, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render child routes
  return <Outlet />;
}
