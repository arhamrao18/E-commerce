import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
 
// Pages only a logged-in customer can see (account, checkout)
export function RequireCustomer({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
 
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
 
// Admin panel: only staff roles, everyone else is sent to the admin login
export function RequireAdmin({ children }) {
  const { user, isStaff, loading } = useAuth();
  const location = useLocation();
 
  if (loading) return null;
  if (!user || !isStaff) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return children;
}
 