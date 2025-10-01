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

  // New: continue as guest
  const continueAsGuest = () =>
    setUser({ id: `guest_${Date.now()}`, name: "Anonymous", anonymous: true });

  return (
    <UserContext.Provider value={{ user, login, logout, continueAsGuest }}>
      {children}
    </UserContext.Provider>
  );
};
