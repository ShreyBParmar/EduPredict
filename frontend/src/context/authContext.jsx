// src/contexts/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

  export const AuthProvider = ({ children }) => {
    // try to load saved user from localStorage (token, role, fullName)
    const [user, setUser] = useState(() => {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    });

    const loginAction = (userData) => {
      // userData expected to include { token, role, fullName }
      setUser(userData);
      // store the whole object so it's available on refresh
      localStorage.setItem("user", JSON.stringify(userData));
    };

    const logOut = () => {
      setUser(null);
      localStorage.removeItem("userToken");
    };

    return (
      <AuthContext.Provider value={{ user, loginAction, logOut }}>
        {children}
      </AuthContext.Provider>
    );
  };

export const useAuth = () => {
  return useContext(AuthContext);
};
