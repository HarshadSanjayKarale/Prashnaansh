import React, { createContext, useState, useContext } from "react";

// Create a context for authentication
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login status

  const login = () => {
    setIsAuthenticated(true); // Set to true when login is successful
  };

  const logout = () => {
    setIsAuthenticated(false); // Set to false when user logs out
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth state
export const useAuth = () => {
  return useContext(AuthContext);
};
