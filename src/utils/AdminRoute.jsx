import { useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import UserContext from './UserContext';
import AccessDenied from './AccessDenied';
import pb from '../../lib/pocketbase';

const AdminRoute = ({ children }) => {
  const { userInfo, loggedinUser, updateLoggedinUser } = useContext(UserContext);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      // Force a refresh of user data
      await updateLoggedinUser();
      
      // Get directly from auth store to be sure
      const isUserLoggedIn = pb.authStore.isValid;
      setIsAuthenticated(isUserLoggedIn);
      
      // Check admin status
      if (isUserLoggedIn && pb.authStore.model) {
        try {
          // Fetch fresh user data to check admin status
          const userData = await pb.collection('users').getOne(pb.authStore.model.id);
          setIsAdmin(userData.isAdmin === true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [updateLoggedinUser]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show access denied page if not an admin
  if (!isAdmin) {
    return <AccessDenied />;
  }

  // If user is logged in and is admin, render the protected route
  return children;
};

export default AdminRoute;