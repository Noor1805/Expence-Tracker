import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  // If user is not logged in or role is not admin, redirect
  if (!user || user.role !== "admin") {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}
