import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // This state is crucial

  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const userData = JSON.parse(userString);
        setUser(userData);
      }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('user');
    }
    setLoading(false); // Mark loading as complete
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
  };
  
  const updateUser = (updatedData) => {
      setUser(prevUser => {
          const newUser = { ...prevUser, ...updatedData };
          localStorage.setItem('user', JSON.stringify(newUser));
          return newUser;
      });
  };

  // The value now also provides the loading state
  const value = { user, loading, login, logout, updateUser };

  // Render children only after initial load attempt is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};