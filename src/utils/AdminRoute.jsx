import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import UserContext from '../utils/UserContext';
import AccessDenied from './AccessDenied';

const AdminRoute = ({ children }) => {
  const { userInfo, loggedinUser } = useContext(UserContext);
  const location = useLocation();
    console.log(loggedinUser);
  const isAdmin = userInfo?.isAdmin;
  const isAuthenticated = loggedinUser !== "";

  if (!isAuthenticated) {
    // Redirect to login if not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Show access denied page if logged in but not admin
    return <AccessDenied />;
  }

  // If user is logged in and is admin, render the protected route
  return children;
};

export default AdminRoute;