import React, { createContext, useState, useEffect } from "react";

// Create context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load persisted user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("safeConnectUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Persist user changes
  useEffect(() => {
    if (user) localStorage.setItem("safeConnectUser", JSON.stringify(user));
    else localStorage.removeItem("safeConnectUser");
  }, [user]);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
