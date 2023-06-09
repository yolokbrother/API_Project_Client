// AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router'; 

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter(); // Initialize useRouter

  const login = (email, uid) => {
    setUser({ email, uid });
  };

  const logout = () => {
    setUser(null);
    router.push('/');
  };

  useEffect(() => {
    // Add logic to check for existing user sessions or tokens
    // and set the user state accordingly
  }, []);

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};