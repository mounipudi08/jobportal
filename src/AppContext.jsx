import React, { createContext, useState } from "react";

// Create a context object
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role") || ""); // Initialize role from localStorage

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AppContext.Provider>
  );
};
