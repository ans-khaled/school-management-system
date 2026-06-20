import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" />;

  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return children;
}

export default ProtectedRoute;
