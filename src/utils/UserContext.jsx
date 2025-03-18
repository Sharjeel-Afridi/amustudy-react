import { createContext, useState, useEffect, useCallback } from 'react';
import pb from '../../lib/pocketbase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedinUser, setLoggedinUser] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateLoggedinUser = useCallback(async () => {
    if (pb.authStore.isValid && pb.authStore.model) {
      try {
        // Get fresh user data
        const userData = await pb.collection('users').getOne(pb.authStore.model.id);
        setLoggedinUser(userData.username);
        setUserInfo(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        
        setLoggedinUser(pb.authStore.model.username);
        setUserInfo(pb.authStore.model);
      }
    } else {
      setLoggedinUser('');
      setUserInfo(null);
    }
    setIsLoading(false);
  }, []);

  // Listen for auth changes
  useEffect(() => {
    // Initial check on component mount
    updateLoggedinUser();
    
    // Set up listener for auth state changes
    pb.authStore.onChange(() => {
      updateLoggedinUser();
    });
    
    // Cleanup function
    return () => {
      // Remove the listener when component unmounts
      pb.authStore.onChange(() => {});
    };
  }, [updateLoggedinUser]);

  return (
    <UserContext.Provider value={{ 
      loggedinUser, 
      userInfo, 
      setLoggedinUser, 
      updateLoggedinUser,
      isAuthLoading: isLoading 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;