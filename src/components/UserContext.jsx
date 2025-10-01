import React, { createContext, useState, useEffect, useContext } from "react";

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("safeConnectUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Persist user
  useEffect(() => {
    if (user) localStorage.setItem("safeConnectUser", JSON.stringify(user));
    else localStorage.removeItem("safeConnectUser");
  }, [user]);

  const login = (userData) => setUser({ ...userData, role: "user" });
  const loginAsGuest = () => setUser({ id: null, role: "guest", name: "Guest" });
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, loginAsGuest, logout }}>
      {children}
    </UserContext.Provider>
  );
};
