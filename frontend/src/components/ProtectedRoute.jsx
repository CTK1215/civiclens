import { Navigate, useLocation } from 'react-router-dom';
import { currentUser } from '../services/token';

// Sends visitors who are not logged in to the login page, and back here after they log in
function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!currentUser()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
